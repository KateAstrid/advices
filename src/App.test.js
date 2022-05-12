import App from "./App";
import { unmountComponentAtNode } from "react-dom";
import { fireEvent, render } from "@testing-library/react";

let div = null;

beforeEach(() => {
  div = document.createElement("div");
  document.body.appendChild(div);
});

afterEach(() => {
  unmountComponentAtNode(div);
  div.remove();
  div = null;
});

it("renders without crushing", () => {
  render(<App />, div);
});

it("shows searched advices", () => {
  const { getByText } = render(<App />, div);

  const input = document.querySelector("[data-testid=searchInput]");

  fireEvent.change(input, { target: { value: "sun" } });
  fireEvent.click(getByText("Search"));
});
