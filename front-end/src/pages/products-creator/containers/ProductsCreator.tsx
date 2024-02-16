import React, { ChangeEvent, startTransition, useContext, useState } from 'react';
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
import { UserContext } from '../../../contexts';

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
    valid: true
  },
  promo: {
    value: true,
    valid: true
  }
};

export const ProductsCreator = () => {
  const userContext = useContext(UserContext);

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
    const {
      name,
      value,
      validity: { valid }
    } = event.target;

    if (['active', 'promo'].includes(name)) {
      setInputs((values) => ({
        ...values,
        [name]: {
          value: !inputs[name].value,
          valid
        }
      }));

      return;
    }

    if (name === 'productImages') {
      const target = event.target as HTMLInputElement;
      const files = target.files as FileList;

      setInputs((values) => ({
        ...values,
        [name]: {
          value: files,
          valid
        }
      }));

      return;
    }

    setInputs((values) => ({
      ...values,
      [name]: {
        value,
        valid
      }
    }));
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('name', inputs.name.value as string);
    formData.append('description', inputs.description.value as string);
    formData.append('price', inputs.price.value?.toString() as string);
    formData.append('isActive', inputs.active.value?.toString() as string);
    formData.append('isPromo', inputs.promo.value?.toString() as string);

    Array.from(inputs.productImages.value as FileList).forEach((file) =>
      formData.append('productImages[]', file)
    );

    console.log(formData);

    request(`${apiUrl}/products/new`, formData, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${userContext.user?.accessToken}`,
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((response) => response.json())
      .then((res) => console.log(res));
  };

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
