import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";

import Grid from "@/components/NewGrid.vue";
import { bulbText, NO_INPUT } from "@/models/Cell";
import type CellState from "@/models/CellState";
import type GridState from "@/models/GridState";

describe('Grid', () => {
  // As a player, I want to add light bulbs to the grid so that I can solve the puzzle.
  it('can have light bulbs added', async () => {
    // Arrange
    const cellState: CellState = {
      isBlack: false,
      number: null,
      input: NO_INPUT
    };

    const gridState: GridState = {
      rows: 1,
      cols: 1,
      cells: [cellState]
    };

    const wrapper = mount(Grid, { props: { gridState } });
    const cell = wrapper.find('div.cell');

    // Act
    await cell.trigger('click');

    // Assert
    expect(cell.text()).toContain(bulbText);
  });
});