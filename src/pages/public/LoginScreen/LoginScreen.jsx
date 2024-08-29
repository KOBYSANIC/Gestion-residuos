import React from "react";

import { useForm } from "react-hook-form";

import { useDispatch, useSelector } from "react-redux";

import { loginToApp, selectLoading } from "../../../redux/features/userSlice";
import { Checkbox, CheckboxGroup } from "@chakra-ui/react";

import InputFormValidation from "../../../components/Inputs/InputFormValidation/InputFormValidation.jsx";
import Button from "../../../components/Buttons/Button/Button.jsx";
import Title from "../../../components/Texts/Title/Title.jsx";
import TextContent from "../../../components/Texts/TextContent/TextContent.jsx";
import { faKey, faEnvelope } from "@fortawesome/free-solid-svg-icons";
// const regEmail =
//   /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const LoginScreen = () => {
  const loading = useSelector(selectLoading);

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    await dispatch(loginToApp(data));
  };

  return (
    <div className="login-container">
      <div className="form-container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Title content="¡Hola otra vez!" />
          <TextContent
            content="Bienvenido al sitio administrativo de Gestión de Residuos"
            marginBottom="12"
          />
          <InputFormValidation
            Icon={faEnvelope}
            placeholder="Ingresa tu correo"
            errors={errors}
            register={register}
            key_name="email"
            label="Escribe tu correo"
            type="text"
          />
          <InputFormValidation
            Icon={faKey}
            placeholder="Ingresa tu contraseña"
            errors={errors}
            register={register}
            key_name="password"
            label="Escribe tu contraseña"
            type="password"
          />

          <Button
            isLoading={loading}
            secondary
            text="Entrar"
            type="submit"
            width="100%"
          />

          <a href="/">
            <TextContent content="Regresar al inicio" marginBottom="12" />
          </a>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
