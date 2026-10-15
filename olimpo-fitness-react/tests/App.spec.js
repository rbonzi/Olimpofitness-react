import React from "react";
import {
  render,
  screen,
  cleanup
} from "@testing-library/react";

import App from "../src/App";

describe("Pruebas unitarias - App Olimpo Fitness", () => {

  afterEach(() => {
    cleanup();
  });

  it("Debe renderizar la aplicación correctamente", () => {

    const { container } = render(<App />);

    expect(container.querySelector("main"))
      .not.toBeNull();

  });

  it("Debe mostrar la página principal", () => {

    window.history.pushState({}, "", "/");

    const { container } = render(<App />);

    expect(container.querySelector("main"))
      .not.toBeNull();

  });

});