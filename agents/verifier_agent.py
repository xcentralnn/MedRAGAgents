"""
agents/verifier_agent.py — Consensus Verifier Agent
──────────────────────────────────────────────────────
Each domain expert votes YES/NO on the synthesised report.
If any expert votes NO, they provide revision advice.
The report is then revised and re-voted (up to MAX_VOTE_ATTEMPTS).

After consensus (or max rounds), a final answer is extracted.

Adapted from MedAgents utils.py (syn_verif branch).
"""

import re
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from agents.base_agent import BaseAgent
import config as cfg


class VerifierAgent:
    """
    Multi-round voting + revision loop.
    """

    def __init__(self, llm_name=None):
        self.voter_agent    = BaseAgent(llm_name=llm_name, max_tokens=50)
        self.advice_agent   = BaseAgent(llm_name=llm_name, max_tokens=600)
        self.revision_agent = BaseAgent(llm_name=llm_name, max_tokens=2500)
        self.answer_agent   = BaseAgent(llm_name=llm_name, max_tokens=2500)
        self.max_attempts   = cfg.MAX_VOTE_ATTEMPTS

    # ── main entry ───────────────────────────────────────────
    def verify_and_answer(
        self,
        syn_report: str,
        all_domains: list[str],
    ) -> dict:
        """
        Run the voting-revision loop, then extract the final answer.

        Returns:
            {
                "pred_answer":    "A",
                "raw_output":     "...",
                "vote_history":   [{domain: yes/no, ...}, ...],
                "revision_history": [{domain: advice, ...}, ...],
                "syn_repo_history": [syn_report, revised1, ...],
            }
        """
        vote_history     = []
        revision_history = []
        syn_repo_history = [syn_report]

        num_try  = 0
        has_no   = True  # enter loop

        while num_try < self.max_attempts and has_no:
            num_try += 1
            has_no   = False
            domain_opinions  = {}
            revision_advice  = {}

            for domain in all_domains:
                opinion = self._vote(domain, syn_report)
                domain_opinions[domain] = opinion
                if opinion == "no":
                    advice = self._get_advice(domain, syn_report)
                    revision_advice[domain] = advice
                    has_no = True

            vote_history.append(domain_opinions)

            if has_no:
                syn_report = self._revise(syn_report, revision_advice)
                revision_history.append(revision_advice)
                syn_repo_history.append(syn_report)

        # Final answer derivation
        raw = self._derive_final_answer(syn_report)
        ans = self.answer_agent.extract_answer_letter(raw)

        return {
            "pred_answer":      ans,
            "raw_output":       raw,
            "vote_history":     vote_history,
            "revision_history": revision_history,
            "syn_repo_history": syn_repo_history,
            "final_syn_report": syn_report,
        }

    # ── voting ───────────────────────────────────────────────
    def _vote(self, domain: str, syn_report: str) -> str:
        """Ask domain expert to vote YES or NO on the report."""
        system = f"You are a medical expert specialized in the {domain} domain."
        user   = (
            f"Here is a medical report:\n{syn_report}\n\n"
            f"As a medical expert specialized in {domain}, please carefully read "
            f"the report and decide whether your opinions are consistent with this report.\n"
            f"Please respond ONLY with: YES or NO."
        )
        raw = self.voter_agent.call(system=system, user=user)
        return self._parse_vote(raw)

    @staticmethod
    def _parse_vote(raw: str) -> str:
        low = raw.lower()
        matches = re.findall(r"\b(yes|no)\b", low)
        return matches[0] if matches else "yes"   # default to yes

    # ── advice ───────────────────────────────────────────────
    def _get_advice(self, domain: str, syn_report: str) -> str:
        system = f"You are a medical expert specialized in the {domain} domain."
        user   = (
            f"Here is a medical report:\n{syn_report}\n\n"
            f"As a medical expert specialized in {domain}, please make full use of "
            f"your expertise to propose revisions to this report.\n"
            f"Output EXACTLY in the format: '''Revisions: [proposed revision advice]'''"
        )
        return self.advice_agent.call(system=system, user=user)

    # ── revision ─────────────────────────────────────────────
    def _revise(self, syn_report: str, revision_advice: dict) -> str:
        user = f"Here is the original report:\n{syn_report}\n\n"
        for domain, advice in revision_advice.items():
            user += f"Advice from a medical expert specialized in {domain}: {advice}.\n"
        user += (
            f"\nBased on the above advice, output the revised analysis EXACTLY in "
            f"the format: '''Total Analysis: [revised analysis]'''"
        )
        raw = self.revision_agent.call(system="", user=user)
        # Wrap revised text back into a full report
        if "Total Analysis:" in raw:
            total = raw.split("Total Analysis:", 1)[1].strip()
        else:
            total = raw.strip()
        # Preserve original question/options header if present
        header = ""
        for line in syn_report.split("\n"):
            if line.startswith("Question:") or line.startswith("Options:") or line.startswith("Key Knowledge:"):
                header += line + "\n"
        return header + f"Total Analysis: {total}"

    # ── final answer ─────────────────────────────────────────
    def _derive_final_answer(self, syn_report: str) -> str:
        user = (
            f"Here is a synthesised report:\n{syn_report}\n\n"
            f"Based on the above report, select the optimal choice to answer the question.\n"
            f"Points to note:\n"
            f"1. The analyses provided should guide you towards the correct response.\n"
            f"2. Any option containing incorrect information cannot be the correct choice.\n"
            f"3. Please respond ONLY with the selected option's letter (A, B, C, D, or E) "
            f"using the format: '''Option: [Selected Option's Letter]'''"
        )
        return self.answer_agent.call(system="", user=user)
