import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders main App page", () => {
  render(<App />);
  const linkElement = screen.getByText(/TR7/i);
  expect(linkElement).toBeInTheDocument();
});
