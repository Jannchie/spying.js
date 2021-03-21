import { Spy } from "../src/Spy";
test("Init Spy", () => {
  new Spy();
});
test("Use Options", () => {
  const s = new Spy({ concurrency: 1, name: "test" });
  expect(s.concurrency).toBe(1);
  expect(s.name).toBe("test");
});
test("Get Google", async () => {
  const s = new Spy({
    URLGener: ["https://www.google.com"],
    onRes: async (res) => {
      console.log(res.url);
    },
  });
  await s.start();
});
test("Set Cookies", async () => {
  const s = new Spy({
    URLGener: ["http://api.bilibili.com/x/web-interface/card?mid=1850091"],
    onRes: async (res) => {
      const j = JSON.parse(res.body);
      console.log(j);
    },
  });
  await s.start();
  expect(s.cookiesMap.has("bfe_id")).toBeTruthy();
});

test("Use gener", async () => {
  const s = new Spy({
    URLGener: (async function* () {
      yield "";
    })(),
    onRes: async (res) => {
      console.log(res.url);
    },
  });
  await s.start();
});

test("user agent", async () => {
  const s = new Spy({
    URLGener: (async function* () {
      yield "http://www.baidu.com";
    })(),
    userAgent: "test",
    onRes: async (res) => {},
  });
  await s.start();
});

// test("proxy", async () => {
//   const s = new Spy({
//     URLGener: (async function* () {
//       yield "http://www.baidu.com";
//     })(),
//     userAgent: "test",
//     onRes: async (res) => {},
//     proxy: { host: "localhost", port: 8888 },
//   });
//   await s.start();
// });
