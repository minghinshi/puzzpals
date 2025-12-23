import { describe, expect, it } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";

import Grid from "@/components/NewGrid.vue";
import { bulbText, dotText, NO_INPUT, BULB, DOT } from "@/models/Cell";
import type CellState from "@/models/CellState";
import type GridState from "@/models/GridState";

function getGridWrapper(initialInput: number) {
  const cellState: CellState = {
    isBlack: false,
    number: null,
    input: initialInput
  };

  const gridState: GridState = {
    rows: 1,
    cols: 1,
    cells: [cellState]
  };

  return mount(Grid, { props: { gridState } });
}

function getFirstCellElement(gridWrapper: VueWrapper) {
  return gridWrapper.find('div.cell');
}

describe('Grid', () => {
  // As a player, I want to add light bulbs to the grid 
  // so that I can solve the puzzle.
  it('can add light bulbs', async () => {
    const wrapper = getGridWrapper(NO_INPUT);
    const cell = getFirstCellElement(wrapper);

    await cell.trigger('click');

    expect(cell.text()).toContain(bulbText);
  });

  it('cannot add light bulbs to black cells', async () => {
    const cellState: CellState = {
      isBlack: true,
      number: null,
      input: NO_INPUT
    };

    const gridState: GridState = {
      rows: 1,
      cols: 1,
      cells: [cellState]
    };

    const wrapper = mount(Grid, { props: { gridState } });
    const cell = getFirstCellElement(wrapper);

    await cell.trigger('click');

    expect(cell.text()).not.toContain(bulbText);
  });

  // As a player, I want to remove light bulbs 
  // so that I can correct mistakes.
  it('can remove light bulbs', async () => {
    const wrapper = getGridWrapper(BULB);
    const cell = getFirstCellElement(wrapper);

    await cell.trigger('click');

    expect(cell.text()).not.toContain(bulbText);
  });

  // As a player, I want to mark which cells do not have bulbs
  // so that I do not need to keep track manually.
  it('can add notes', async () => {
    const wrapper = getGridWrapper(NO_INPUT);
    const cell = getFirstCellElement(wrapper);

    await cell.trigger('contextmenu');

    expect(cell.text()).toContain(dotText);
  });

  it('can remove notes', async () => {
    const wrapper = getGridWrapper(DOT);
    const cell = getFirstCellElement(wrapper);

    await cell.trigger('contextmenu');

    expect(cell.text()).not.toContain(dotText);
  });
});