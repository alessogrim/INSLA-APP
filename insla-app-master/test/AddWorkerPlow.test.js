import "react-native";
import React from "react";
import AddWorkerPlow from "../src/Components/Jobs/AddWorkerPlow";
import renderer from "react-test-renderer";

it("Using a valid id", () => {
  jest.useFakeTimers();
  let Interface = renderer.create(<AddWorkerPlow />).getInstance();
  expect(Interface.evaluation("0801-1997-23174")).toEqual(true);
});
it("Using a invalid id using less than 13 numbers", () => {
  jest.useFakeTimers();
  let Interface = renderer.create(<AddWorkerPlow />).getInstance();
  expect(Interface.evaluation("0801-1997-2317")).toEqual(false);
});
it("Using a invalid id using more than 13 numbers", () => {
  jest.useFakeTimers();
  let Interface = renderer.create(<AddWorkerPlow />).getInstance();
  expect(Interface.evaluation("0801-1997-231741")).toEqual(false);
});
it("Using a invalid id using letter", () => {
  jest.useFakeTimers();
  let Interface = renderer.create(<AddWorkerPlow />).getInstance();
  expect(Interface.evaluation("0cs1-1997-23174")).toEqual(false);
});

it("Using a valid name", () => {
  jest.useFakeTimers();
  let Interface = renderer.create(<AddWorkerPlow />).getInstance();
  expect(Interface.evaluation("Carlos", "name")).toEqual(true);
});

it("Using a invalid name with a number", () => {
  jest.useFakeTimers();
  let Interface = renderer.create(<AddWorkerPlow />).getInstance();
  expect(Interface.evaluation("Carlos12", "name")).toEqual(false);
});

it("Using a invalid name with 2 letters", () => {
  jest.useFakeTimers();
  let Interface = renderer.create(<AddWorkerPlow />).getInstance();
  expect(Interface.evaluation("C", "name")).toEqual(false);
});

it("Using a valid lastname", () => {
  jest.useFakeTimers();
  let Interface = renderer.create(<AddWorkerPlow />).getInstance();
  expect(Interface.evaluation("Carlos", "lastName")).toEqual(true);
});

it("Using a invalid lastname with a number", () => {
  jest.useFakeTimers();
  let Interface = renderer.create(<AddWorkerPlow />).getInstance();
  expect(Interface.evaluation("Carlos12", "lastName")).toEqual(false);
});

it("Using a invalid lastname with 2 letters", () => {
  jest.useFakeTimers();
  let Interface = renderer.create(<AddWorkerPlow />).getInstance();
  expect(Interface.evaluation("Cs", "lastName")).toEqual(false);
});

it("Using a valid age", () => {
  jest.useFakeTimers();
  let Interface = renderer.create(<AddWorkerPlow />).getInstance();
  expect(Interface.evaluation("24", "age")).toEqual(true);
});

it("Using a invalid age with one number", () => {
  jest.useFakeTimers();
  let Interface = renderer.create(<AddWorkerPlow />).getInstance();
  expect(Interface.evaluation("5", "age")).toEqual(false);
});

it("Using a invalid age using a letter", () => {
  jest.useFakeTimers();
  let Interface = renderer.create(<AddWorkerPlow />).getInstance();
  expect(Interface.evaluation("C", "age")).toEqual(false);
});

it("Using a invalid age with a negative number", () => {
  jest.useFakeTimers();
  let Interface = renderer.create(<AddWorkerPlow />).getInstance();
  expect(Interface.evaluation("-20", "age")).toEqual(false);
});

it("Using a valid description", () => {
  jest.useFakeTimers();
  let Interface = renderer.create(<AddWorkerPlow />).getInstance();
  expect(
    Interface.evaluation("Prepara el suelo para ser arado", "description")
  ).toEqual(true);
});

it("Using a invalid description using numbers", () => {
  jest.useFakeTimers();
  let Interface = renderer.create(<AddWorkerPlow />).getInstance();
  expect(
    Interface.evaluation("Prepara el suelo para 4545ado", "description")
  ).toEqual(false);
});

it("Using a valid pay day", () => {
  jest.useFakeTimers();
  let Interface = renderer.create(<AddWorkerPlow />).getInstance();
  expect(Interface.evaluation("50", "payDay")).toEqual(true);
});

it("Using a invalid pay day using negative numbers", () => {
    jest.useFakeTimers();
    let Interface = renderer.create(<AddWorkerPlow />).getInstance();
    expect(Interface.evaluation("-50", "payDay")).toEqual(false);
  });

  it("Using a invalid pay day using 1 digit", () => {
    jest.useFakeTimers();
    let Interface = renderer.create(<AddWorkerPlow />).getInstance();
    expect(Interface.evaluation("5", "payDay")).toEqual(false);
  });

  it("Using a valid day worked", () => {
    jest.useFakeTimers();
    let Interface = renderer.create(<AddWorkerPlow />).getInstance();
    expect(Interface.evaluation("5", "dayWorked")).toEqual(true);
  });

  it("Using a invalid day worked without days", () => {
    jest.useFakeTimers();
    let Interface = renderer.create(<AddWorkerPlow />).getInstance();
    expect(Interface.evaluation("_", "dayWorked")).toEqual(false);
  });

  it("Using a invalid day worked with a letter", () => {
    jest.useFakeTimers();
    let Interface = renderer.create(<AddWorkerPlow />).getInstance();
    expect(Interface.evaluation("c", "dayWorked")).toEqual(false);
  });

  it("Using a invalid day worked with a negative digit", () => {
    jest.useFakeTimers();
    let Interface = renderer.create(<AddWorkerPlow />).getInstance();
    expect(Interface.evaluation("-5", "dayWorked")).toEqual(false);
  });