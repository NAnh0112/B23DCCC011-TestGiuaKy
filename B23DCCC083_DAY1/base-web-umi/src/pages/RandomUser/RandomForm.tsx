import React from "react";
import { Form, Input, Button } from "antd";

interface RandomUser {
  address: string;
  balance: number;
}

interface RandomFormProps {
  data: RandomUser[];
  row?: RandomUser;
  isEdit: boolean;
  setVisible: (visible: boolean) => void;
  getDataUser: () => void;
}

const RandomForm: React.FC<RandomFormProps> = ({ data, row, isEdit, setVisible, getDataUser }) => {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      onFinish={(values) => {
        const index = data.findIndex((item) => item.address === row?.address);
        const dataTemp: RandomUser[] = [...data];

        if (isEdit) {
          dataTemp.splice(index, 1, values);
        } else {
          dataTemp.unshift(values);
        }

        localStorage.setItem("data", JSON.stringify(dataTemp));
        setVisible(false);
        getDataUser();
      }}
    >
      <Form.Item
        initialValue={row?.address}
        label="Address"
        name="address"
        rules={[{ required: true, message: "Please input your address!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        initialValue={row?.balance}
        label="Balance"
        name="balance"
        rules={[{ required: true, message: "Please input your balance!" }]}
      >
        <Input />
      </Form.Item>

      <div className="form-footer">
        <Button htmlType="submit" type="primary">
          {isEdit ? "Save" : "Insert"}
        </Button>
        <Button onClick={() => setVisible(false)}>Cancel</Button>
      </div>
    </Form>
  );
};

export default RandomForm;
