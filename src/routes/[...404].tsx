import { Title } from "@solidjs/meta";
import { HttpStatusCode } from "@solidjs/start";

export default function NotFound() {
  return (
    <>
      <Title>Not Found</Title>
      <HttpStatusCode code={404} />
      <div class="text-center p-4">
        <h1 class="text-4xl uppercase my-4">Page Not Found</h1>
      </div>
    </>
  );
}
