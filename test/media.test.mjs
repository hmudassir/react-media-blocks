import { test } from "node:test";
import assert from "node:assert/strict";
import { youtubeId, mediaUrl, mosaicLayout, clampColumns } from "../src/media/media.js";

test("youtubeId accepts IDs and every common URL form", () => {
  const id = "YE7VzlLtp-4";
  for (const input of [
    id,
    `https://www.youtube.com/watch?v=${id}`,
    `https://www.youtube.com/watch?feature=share&v=${id}&t=30`,
    `https://youtu.be/${id}`,
    `https://youtu.be/${id}?t=10`,
    `https://www.youtube.com/shorts/${id}`,
    `https://www.youtube.com/embed/${id}`,
    `https://www.youtube-nocookie.com/embed/${id}`,
    `https://m.youtube.com/watch?v=${id}`,
    `https://www.youtube.com/live/${id}`,
  ]) assert.equal(youtubeId(input), id, input);
});

test("youtubeId rejects anything else", () => {
  for (const input of ["", "not a video", "https://vimeo.com/123456", `https://evil.example/watch?v=YE7VzlLtp-4`, "https://www.youtube.com/watch?v=short", null])
    assert.equal(youtubeId(input ?? ""), null, String(input));
});

test("mediaUrl prefixes relative paths and leaves full URLs alone", () => {
  assert.equal(mediaUrl("/samples/a.jpg", "https://cdn.example.com/"), "https://cdn.example.com/samples/a.jpg");
  assert.equal(mediaUrl("samples/a.jpg", "https://cdn.example.com"), "https://cdn.example.com/samples/a.jpg");
  assert.equal(mediaUrl("/samples/a.jpg"), "/samples/a.jpg");
  assert.equal(mediaUrl("https://other.example/x.jpg", "https://cdn.example.com"), "https://other.example/x.jpg");
  assert.equal(mediaUrl("data:image/png;base64,AAA", "https://cdn.example.com"), "data:image/png;base64,AAA");
  assert.equal(mediaUrl(""), "");
});

test("mosaicLayout counts cells and reports gaps", () => {
  const full = [{ span: "large" }, { span: "tall" }, {}, {}, { span: "wide" }, { span: "tall" }, {}, { span: "wide" }, {}];
  assert.deepEqual(mosaicLayout(full, 4), { cells: 16, rows: 4, complete: true, missing: 0 });
  assert.deepEqual(mosaicLayout([{ span: "large" }, {}], 4), { cells: 5, rows: 2, complete: false, missing: 3 });
  assert.equal(mosaicLayout([{ span: "unknown" }], 2).cells, 1, "unknown spans count as one cell");
});

test("columns are clamped to 2–4", () => {
  assert.deepEqual([1, 2, 3, 4, 9, "x"].map(clampColumns), [2, 2, 3, 4, 4, 3]);
});
