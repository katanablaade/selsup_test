import { useCallback, useState } from 'react';
import './App.css';

// Типы и интерфейсы
type ParamType = 'string' | 'number';

interface ParamValue {
  paramId: number;
  value: string;
}

interface Params {
  id: number;
  name: string;
  type: ParamType;
}

interface Model {
  paramValues: ParamValue[];
}

interface EditorParam extends Params {
  value: ParamValue['value'];
}

interface AddParamFormProps {
  addParam: (param: EditorParam) => void;
}

interface ParamListProps {
  items: EditorParam[];
  updateParam: (id: number, value: string) => void;
  deleteParam: (id: number) => void;
}

interface InputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  name: string;
  onChangeCallback?: (value: string) => void;
}

// Вводные данные
const initModel: Model = {
  paramValues: [
    {
      paramId: 1,
      value: 'повседневное',
    },
    {
      paramId: 2,
      value: 'макси',
    },
  ],
};

const initParams: Params[] = [
  {
    id: 1,
    name: 'Назначение',
    type: 'string',
  },
  {
    id: 2,
    name: 'Длина',
    type: 'string',
  },
];

// Компоненты
function App() {
  const { addParam, deleteParam, params, updateParam } = useParamEditor(
    initModel,
    initParams
  );

  return (
    <div className="app">
      <main>
        <AddParam addParam={addParam} />
        <ParamsList
          items={params}
          updateParam={updateParam}
          deleteParam={deleteParam}
        />
      </main>
    </div>
  );
}

function AddParam({ addParam }: AddParamFormProps) {
  const [type, setType] = useState<ParamType>('string');
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const types: ParamType[] = ['string', 'number'];

  const handleTypeChange = useCallback((type: ParamType) => {
    setType(type);
    setValue('');
  }, []);

  const handleNameChange = useCallback((name: string) => {
    setName(name);
  }, []);

  const handleValueChange = useCallback((value: string) => {
    setValue(value);
  }, []);

  const onSubmit = useCallback(() => {
    addParam({ id: randomId(), name, type, value });
    setName('');
    setValue('');
  }, [name, value, type, addParam]);

  const isParamValid = () => {
    return [name, value].some((param) => !param.trim());
  };

  return (
    <div className="container">
      <div className="input-list">
        <label>
          Type:
          <br />
          <select
            value={type}
            onChange={(e) => handleTypeChange(e.target.value as ParamType)}
          >
            {types.map((type, i) => (
              <option key={i} value={type}>
                {type[0].toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </label>
        <>
          <Input name="Name" value={name} onChangeCallback={handleNameChange} />
          {
            <Input
              name="Value"
              type={type}
              value={value}
              onChangeCallback={handleValueChange}
            />
          }
        </>
      </div>
      <button onClick={onSubmit} disabled={isParamValid()}>
        Добавить
      </button>
    </div>
  );
}

function ParamsList({ items, updateParam, deleteParam }: ParamListProps) {
  const onButtonLog = useCallback(() => {
    console.log(items);
  }, [items]);

  return (
    <div className="container">
      <div className="input-list">
        {items.map((item) => (
          <div className="input-list__item" key={item.id}>
            <Input
              name={item.name}
              type={item.type}
              value={item.value}
              onChange={(e) => updateParam(item.id, e.target.value)}
            />
            <button
              onClick={() => deleteParam(item.id)}
              className="input-list__delete-button"
            >
              x
            </button>
          </div>
        ))}
      </div>
      <button onClick={onButtonLog}>Вывод в консоль</button>
    </div>
  );
}

function Input({ name, onChangeCallback, ...props }: InputProps) {
  return (
    <label>
      {name}:<br />
      <input
        maxLength={20}
        onChange={
          onChangeCallback ? (e) => onChangeCallback(e.target.value) : undefined
        }
        {...props}
      />
    </label>
  );
}

// Хук для работы с параметрами и функция-рандомайзер уникального id
export const useParamEditor = (model: Model, initParams: Params[]) => {
  const [params, setParams] = useState(() => {
    const values = model.paramValues;
    const params: EditorParam[] = [];

    initParams.forEach((param) => {
      const paramValue = values.find((v) => v.paramId === param.id);
      if (paramValue) {
        params.push({
          id: param.id,
          name: param.name,
          type: param.type,
          value: paramValue.value,
        });
      }
    });

    return params;
  });

  const addParam = (param: EditorParam) => {
    setParams((prevParams) => [...prevParams, param]);
  };

  const updateParam = (
    paramId: EditorParam['id'],
    value: EditorParam['value']
  ) => {
    setParams((prevParams) =>
      prevParams.map((param) =>
        param.id === paramId ? { ...param, value } : param
      )
    );
  };

  const deleteParam = (paramId: EditorParam['id']) => {
    setParams((prevParams) =>
      prevParams.filter((param) => param.id !== paramId)
    );
  };

  return {
    params,
    addParam,
    deleteParam,
    updateParam,
  };
};

function randomId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

export default App;
