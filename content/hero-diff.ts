// Illustrative snippet pair for the hero. Written for this page — not code from any client system.
export const heroDiff = {
  left: {
    title: "POLICY-LIST.cbl",
    lang: "COBOL",
    lines: [
      "       PROCEDURE DIVISION.",
      "       0000-MAIN.",
      "           OPEN INPUT POLICY-FILE",
      "           PERFORM UNTIL WS-EOF = 'Y'",
      "               READ POLICY-FILE",
      "                   AT END MOVE 'Y' TO WS-EOF",
      "                   NOT AT END PERFORM 1000-LIST",
      "               END-READ",
      "           END-PERFORM",
      "           CLOSE POLICY-FILE",
      "           STOP RUN.",
    ],
  },
  right: {
    title: "PolicyController.java",
    lang: "Java 17 · Spring Boot 3",
    lines: [
      "@RestController",
      '@RequestMapping("/policies")',
      "class PolicyController {",
      "  private final PolicyRepository repo;",
      "",
      "  @GetMapping",
      "  List<PolicySummary> list(@RequestParam String holder) {",
      "    return repo.findByHolder(holder).stream()",
      "        .map(PolicySummary::from)",
      "        .toList();",
      "  }",
      "}",
    ],
  },
};
