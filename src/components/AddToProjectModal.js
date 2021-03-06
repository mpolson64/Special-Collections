import React, { useState } from "react";
import { Modal } from "antd";
import { addItemsToItemSet } from "../utils/Utils";
import ProjectDropdown from "./ProjectDropdown";

// visible, selectedRowKeys
const AddToProjectModal = (props) => {
  const [receiveProject, setReceiveProject] = useState();

  const onProjectAdd = () => {
    if (!receiveProject) {
      Modal.error({
        title: "Fail to add to project!",
        content: "A project should be selected.",
      });
      return;
    }
    addItemsToItemSet(receiveProject, props.selectedRowKeys)
      .then(() => {
        Modal.success({
          title: "Success!",
          content: "Add to project successes.",
        });
        props.onClose();
      })
      .catch((error) => {
        Modal.error({
          title: "Failed!",
          content: "Add to project fails.",
        });
        props.onClose();
      });
  };

  return (
    <Modal
      title="Add to Project"
      centered
      visible={props.visible}
      onOk={onProjectAdd}
      onCancel={() => {
        props.onClose();
      }}
    >
      <ProjectDropdown
        onMenuSelect={(projectId) => {
          setReceiveProject(projectId);
        }}
      />
    </Modal>
  );
};

export default AddToProjectModal;
