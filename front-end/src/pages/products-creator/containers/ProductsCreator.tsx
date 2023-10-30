import React, { ChangeEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';

import { Button, Checkbox, FilesUploader, LabeledInput } from '../../../components';
import { LabeledTextArea } from '../../../components/labeled-textarea';

const initialInputsState = {
  name: {
    value: '',
    valid: false
  },
  description: {
    value: '',
    valid: false
  },
  images: {
    value: [],
    valid: false
  },
  active: {
    value: true,
    valid: false
  },
  promo: {
    value: true,
    valid: false
  }
};

export const ProductsCreator = () => {
  const [inputs, setInputs] = useState(initialInputsState);
  const dispatch: Dispatch = useDispatch();

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const {
      name,
      value,
      validity: { valid }
    } = event.target;

    setInputs((values) => ({
      ...values,
      [name]: {
        value,
        valid
      }
    }));
  };

  const handleSubmit = () => console.log(inputs);

  return (
    <div className="container">
      <div className="row">
        <header className="col-md-6 offset-md-3 col-sm-8 offset-sm-2 col-12">
          <img alt="Left arrow" id="left-arrow" src="/icons/left-arrow.svg" />
          <h1>Creator of product</h1>
        </header>
      </div>

      <div className="row">
        <form className="col-md-6 offset-md-3 col-sm-8 offset-sm-2 col-12">
          <LabeledInput
            change={handleChange}
            label="Name"
            name="name"
            minLength={5}
            placeholder="Enter name"
            required={true}
            type="text"
          />

          <LabeledTextArea
            change={handleChange}
            name="description"
            label="Description"
            placeholder="Enter description"
            required={true}
          />

          <FilesUploader
            change={handleChange}
            accept=".jpg, .jpeg, .png"
            multiple={true}
            name="image"
          />

          <Checkbox change={handleChange} checked={inputs.promo.value} label="Promo" name="promo" />

          <Checkbox
            change={handleChange}
            checked={inputs.active.value}
            label="Active"
            name="active"
          />

          <Button
            click={handleSubmit}
            disabled={Object.values(inputs).some(({ valid }) => !valid)}
            theme="primary"
          >
            Create
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ProductsCreator;
