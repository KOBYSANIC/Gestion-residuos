import React from "react";
import InputFormValidation from "../../../../components/Inputs/InputFormValidation/InputFormValidation";
import { DateIcon, TitleIcon } from "../../../../Utils/icons";
import { discount_state } from "../../../../Utils/constants";
import InputSelect from "../../../../components/Inputs/InputSelect";

const FormDiscount = ({
  errors,
  register,
  control,
  discounted,
  setValue,
  productSelected,
  discounted_from,
  discounted_until,
}) => {
  const handleDiscountValue = (e) => {
    const discount_percentage = (e.target.value * 100) / productSelected.price;
    setValue("discounted_value", e.target.value);
    setValue("discount_percentage", discount_percentage.toFixed(0));
  };

  const handleDiscountPercentage = (e) => {
    setValue("discount_percentage", e.target.value);
    setValue(
      "discounted_value",
      ((e.target.value * productSelected.price) / 100).toFixed(2)
    );
  };

  return (
    <>
      <InputFormValidation
        Icon={TitleIcon}
        placeholder="Ingrese el nombre del producto"
        errors={errors}
        register={register}
        key_name="product_name"
        label="Nombre del producto"
        disabled
      />

      <InputFormValidation
        Icon={TitleIcon}
        placeholder="Ingrese el precio del producto"
        errors={errors}
        register={register}
        key_name="price"
        label="Precio del producto"
        minLength={1}
        disabled
      />

      <InputFormValidation
        Icon={TitleIcon}
        placeholder="Ingrese precio de descuento"
        errors={errors}
        register={register}
        key_name="discounted_value"
        label="Precio de descuento"
        type="number"
        minLength={1}
        min={1}
        max={productSelected.price}
        onChange={handleDiscountValue}
        step="any"
      />

      <InputFormValidation
        Icon={TitleIcon}
        placeholder="Ingrese el porcentaje de descuento"
        errors={errors}
        register={register}
        key_name="discount_percentage"
        label="Porcentaje de descuento"
        type="number"
        minLength={1}
        min={1}
        max={100}
        onChange={handleDiscountPercentage}
        step="any"
      />

      <InputFormValidation
        Icon={DateIcon}
        placeholder="Ingresa la fecha de inicio del descuento"
        errors={errors}
        register={register}
        key_name="discounted_from"
        label="Fecha inicio del descuento"
        type="date"
        max={discounted_until || productSelected.discounted_until}
        // validation={false}
      />

      <InputFormValidation
        Icon={DateIcon}
        placeholder="Ingresa la fecha de fin del descuento"
        errors={errors}
        register={register}
        key_name="discounted_until"
        label="Fecha final del descuento"
        type="date"
        min={discounted_from || productSelected.discounted_from}
      />

      <InputSelect
        options={discount_state}
        defaultOptionValue={discounted}
        placeholder="Estado del descuento"
        errors={errors}
        register={register}
        control={control}
        key_name="discounted"
        label="Selecciona el estado del descuento"
      />
    </>
  );
};

export default FormDiscount;
