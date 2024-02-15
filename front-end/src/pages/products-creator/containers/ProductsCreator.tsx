import React, { ChangeEvent, startTransition, useState } from 'react';
import { useNavigate } from 'react-router';

import { apiUrl } from '../../../api';
import {
  Button,
  Checkbox,
  FilesUploader,
  LabeledInput,
  LabeledTextArea
} from '../../../components';
import { Input } from '../../../models';
import { request } from '../../../utils';

const initialInputsState: Input = {
  name: {
    value: '',
    valid: false
  },
  description: {
    value: '',
    valid: false
  },
  price: {
    value: '',
    valid: false
  },
  productImages: {
    value: null,
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

  const navigate = useNavigate();

  const goToDashboard = async () => {
    startTransition(() => {
      navigate('/');
    });
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;

    const {
      name,
      value,
      validity: { valid }
    } = event.target;

    if (files?.length) {
      console.log(files);

      setInputs((values) => ({
        ...values,
        [name]: {
          value: files,
          valid
        }
      }));
      console.log(inputs);
      return;
    }
  };

  const handleSubmit = () =>
    request(`${apiUrl}/products/new`, {
      name: inputs.name.value,
      description: inputs.description.value,
      price: inputs.price.value,
      isActive: inputs.active.value,
      isPromo: inputs.promo.value,
      productImages: inputs.productImages.value
    }).then((res) => console.log(res));
  // .then(() => navigate('/'));

  return (
    <div className="container">
      <div className="row">
        <header className="col-md-6 offset-md-3 col-sm-8 offset-sm-2 col-12">
          <button onClick={() => goToDashboard()} type="button">
            <img alt="Left arrow" src="/icons/left-arrow.svg" />
          </button>

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

          <LabeledInput
            change={handleChange}
            label="Price"
            name="price"
            pattern="^\d*(\.\d{0,2})?$"
            placeholder="Enter price"
            required={true}
            step=".01"
            type="number"
          />

          <FilesUploader
            change={handleChange}
            accept=".jpg, .jpeg, .png"
            multiple={true}
            name="productImages"
          />

          <Checkbox
            change={handleChange}
            checked={inputs.promo.value as boolean}
            label="Promo"
            name="promo"
          />

          <Checkbox
            change={handleChange}
            checked={inputs.active.value as boolean}
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
