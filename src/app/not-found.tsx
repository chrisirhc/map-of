import { Link, Heading } from "@radix-ui/themes";
import NextLink from "next/link";

export default function NotFound() {
  return (
    <div>
      <Heading>Not Found</Heading>
      <Link asChild>
        <NextLink href="/">Return Home</NextLink>
      </Link>
    </div>
  );
}
