import './App.css'
// import UseRef from './Components/UseRef/UseRef'

import React, { useState } from 'react';

interface Param {
  id: number;
  name: string;
}

interface ParamValue {
  paramId: number;
  value: string;
}

interface Model {
  paramValues: ParamValue[];
}

interface Props {
  params: Param[];
  model: Model;
}

const Test: React.FC<Props> = ({ params, model }) => {
  console.log(model);

  const [paramValues, setParamValues] = useState<ParamValue[]>(model?.paramValues);

  const handleChange = (paramId: number, value: string) => {
    setParamValues((prevValues) =>
      prevValues.map((paramValue) =>
        paramValue.paramId === paramId ? { ...paramValue, value } : paramValue
      )
    );
  };

  const getModel = (): Model => {
    return { paramValues };
  };

  return (
    <div>
      {params.map((param) => (
        <div key={param.id}>
          <label>{param.name}</label>
          <input
            type="text"
            value={paramValues.find((pv) => pv.paramId === param.id)?.value || ''}
            onChange={(e) => handleChange(param.id, e.target.value)}
          />
        </div>
      ))}
      <button onClick={() => console.log(getModel())}>Get Model</button>
    </div>
  );
};

export default Test;