import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Header from "../../components/Header";

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("Header Component", () => {
  it("renders without crashing", () => {
    renderWithRouter(<Header />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    renderWithRouter(<Header />);
    expect(screen.getByText(/Contacts/i)).toBeInTheDocument();
    expect(screen.getByText(/Tasks/i)).toBeInTheDocument();
    expect(screen.getByText(/Projects/i)).toBeInTheDocument();
  });
});
