import { HeroDiff } from "@/components/hero/HeroDiff";
import { EndpointResponse } from "@/components/explorer/EndpointResponse";
import { RootIndex } from "@/components/views/RootIndex";

export default function Home() {
  return (
    <>
      <HeroDiff />
      <EndpointResponse href="/">
        <RootIndex />
      </EndpointResponse>
    </>
  );
}
