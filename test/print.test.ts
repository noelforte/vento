import { test } from "./utils.ts";

Deno.test("Print tag", async () => {
  await test({
    template: `
    {{ "Hello world" }}
    `,
    expected: "Hello world",
  });
  await test({
    template: `
    {{ undefined }}
    `,
    expected: "",
  });
  await test({
    template: `
    {{ null }}
    `,
    expected: "",
  });
});

Deno.test("Print tag with variable", async () => {
  await test({
    template: `
    {{ it.message }}
    `,
    expected: "Hello world",
    data: { message: "Hello world" },
  });
});

Deno.test("Print tag with condition", async () => {
  await test({
    template: `
    {{ message || "Hello world" }}
    `,
    expected: "Hello world",
    data: { message: false },
  });

  await test({
    template: `
    {{ message || "Hello world" }}
    `,
    expected: "yes",
    data: { message: "yes" },
  });
});

Deno.test("Print tag with filters", async () => {
  await test({
    template: `
    {{ message |> toUpperCase }}
    `,
    expected: "HELLO WORLD",
    data: { message: "Hello World" },
  });

  await test({
    template: `
    {{ message |> toUpperCase }}
    `,
    expected: "",
    data: { message: 12 },
  });

  await test({
    template: `
    {{ message |> slugify }}
    `,
    expected: "hello-world",
    data: { message: "Hello World" },
    init(env) {
      env.filters.slugify = (value: string) =>
        value.toLowerCase().replace(/\s/g, "-");
    },
  });
});

Deno.test("Print trim", async () => {
  await test({
    template: `Hello {{- "World" }} !`,
    expected: "HelloWorld !",
  });

  await test({
    template: `Hello {{ "World" -}} !`,
    expected: "Hello World!",
  });

  await test({
    template: `Hello {{- "World" -}} !`,
    expected: "HelloWorld!",
  });
});

Deno.test("Print trim with filter", async () => {
  await test({
    template: `Hello {{- "World" |> toUpperCase }} !`,
    expected: "HelloWORLD !",
  });

  await test({
    template: `Hello {{ "World" |> toUpperCase -}} !`,
    expected: "Hello WORLD!",
  });

  await test({
    template: `Hello {{- "World" |> toUpperCase -}} !`,
    expected: "HelloWORLD!",
  });
});

Deno.test({
  name: "Print async filters",
  // @ts-ignore only used to detect node.js
  ignore: globalThis?.process?.release?.name === "node",
  fn: async () => {
    const url = new URL("../deno.json", import.meta.url).href;
    const expected = JSON.stringify(
      JSON.parse(Deno.readTextFileSync(new URL(url))),
    );

    await test({
      template: `{{ url |> await fetch |> await json |> JSON.stringify }}`,
      expected,
      data: { url },
    });
  },
});

Deno.test({
  name: "Print auto async filters",
  // @ts-ignore only used to detect node.js
  ignore: globalThis?.process?.release?.name === "node",
  fn: async () => {
    await test({
      template: `<{{ "foo" |> getAsync }}>`,
      expected: "<FOO>",
      filters: {
        async getAsync(text: string) {
          return await new Promise((resolve) => {
            setTimeout(() => resolve(text.toUpperCase()), 10);
          });
        },
      },
    });
  },
});

// Test for https://github.com/oscarotero/vento/issues/26
Deno.test({
  name: "Print ternary",
  fn: async () => {
    await test({
      template: `{{ message ? "yes" : "no" }}`,
      expected: "yes",
      data: { message: "yes" },
    });

    await test({
      template: `{{ message ? "yes" : "no" }}`,
      expected: "no",
      data: { message: false },
    });

    await test({
      template: `{{ message ? "yes" : "no" }}`,
      expected: "no",
      data: { message: null },
    });

    await test({
      template: `{{ message ? "yes" : "no" }}`,
      expected: "no",
      data: {},
    });
  },
});

// Test for https://github.com/oscarotero/vento/issues/26
Deno.test({
  name: "Print nullish coalescing",
  fn: async () => {
    await test({
      template: `{{ message ?? "no" }}`,
      expected: "yes",
      data: { message: "yes" },
    });

    await test({
      template: `{{ message ?? "no" }}`,
      expected: "no",
      data: {},
    });
  },
});
