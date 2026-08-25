import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { beforeEach, expect, it } from 'vitest';
import { App } from '../../../app';
import { ModalComponent } from './modal.component';

describe(ModalComponent.name, () => {
  const createComponent = createComponentFactory({
    component: ModalComponent,
  });

  let spectator: Spectator<ModalComponent>;

  beforeEach(() => {
    spectator = createComponent({
      props: {
        open: true,
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should match snapshot', () => {
    expect(spectator.element.innerHTML).toMatchSnapshot();
  });
});
