import { describe, expect, it } from "vitest";
import { statusOf, type Work } from "@/lib/classroom";

const w = (d?: number): Work => ({ id: "x", classId: "hci", topic: "t", kind: "assignment", title: "t", instructions: "", postedOffsetDays: -1, attachments: [], dueOffsetDays: d });
const empty = { submissions: {}, drafts: {} };

describe("assignment status", () => {
  it("past due and not submitted is missing", () => expect(statusOf(w(-1), empty)).toBe("missing"));
  it("due within 2 days is due soon", () => expect(statusOf(w(2), empty)).toBe("due-soon"));
  it("due in 3+ days is assigned", () => expect(statusOf(w(3), empty)).toBe("assigned"));
  it("submitted work is done even if past due", () =>
    expect(statusOf(w(-5), { submissions: { x: { files: [], submittedAt: "" } }, drafts: {} })).toBe("done"));
});
