import { getEntries, getPartInfos } from "@/lib/data";
import TimelineClient from "./TimelineClient";

export default function TimelinePage() {
  const entries = getEntries();
  const parts = getPartInfos();
  return <TimelineClient entries={entries} parts={parts} />;
}
