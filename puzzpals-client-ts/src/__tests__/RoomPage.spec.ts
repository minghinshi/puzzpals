import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";

import socket from "@/__mocks__/socket";
import api from "@/__mocks__/api";

import { BULB, bulbText, NO_INPUT } from "@/models/Cell";
import type GridState from "@/models/GridState";
import RoomPage from "@/views/RoomPage.vue";

vi.mock('@/socket', () => { return { default: socket }; });
vi.mock('@/services/api', () => { return { default: api }; });

describe('RoomPage', () => {
  const gridState: GridState = {
    rows: 1,
    cols: 2,
    cells: [{
      isBlack: true,
      number: 1,
      input: NO_INPUT
    }, {
      isBlack: false,
      number: null,
      input: BULB
    }]
  };

  // As a player, I want to synchronise my progress with other players
  // so that we can collaborate on the same puzzle.
  it('synchronises your grid upon entering room', async () => {
    const wrapper = mount(RoomPage, { props: { token: 'TestRm' } });

    socket.emitServerEvent('grid:state', gridState);
    await nextTick();

    const cells = wrapper.findAll('div.cell');
    expect(cells).toHaveLength(2);

    expect(cells[0]?.text()).toStrictEqual('1');
    expect(cells[0]?.classes()).toContain('black');

    expect(cells[1]?.text()).toStrictEqual(bulbText);
    expect(cells[1]?.classes()).toContain('white');
  });

  it('synchronises your grid when others edit a cell', async () => {
    const wrapper = mount(RoomPage, { props: { token: 'TestRm' } });

    // Set up the grid
    socket.emitServerEvent('grid:state', gridState);
    await nextTick();

    const data = {
      idx: 1,
      value: {
        isBlack: false,
        number: null,
        input: NO_INPUT
      }
    };

    // Update the second cell
    socket.emitServerEvent('grid:cellUpdated', data);
    await nextTick();

    const cell = wrapper.findAll('div.cell')[1];
    expect(cell?.text()).toStrictEqual('');
  });

  it('synchronises other grids when you edit a cell', async () => {
    const wrapper = mount(RoomPage, { props: { token: 'TestRm' } });

    // Set up the grid
    socket.emitServerEvent('grid:state', gridState);
    await nextTick();

    // Click the second cell
    const cell = wrapper.findAll('div.cell')[1];
    await cell?.trigger('click');

    const expectedEvent = {
      ev: 'grid:updateCell',
      payload: {
        token: 'TestRm',
        idx: 1,
        value: {
          isBlack: false,
          number: null,
          input: NO_INPUT
        }
      }
    };

    // Assert data emitted to socket
    expect(socket.getLatestEvent()).toStrictEqual(expectedEvent);
  });
});