import { Button } from "@mui/material";
import { useState } from "react";
import { CreateGameModal } from "./CreateGameModal";

const MiniGameManagement = () => {
  // STATES
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // FUNCTIONS
  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  return (
    <div className="w-full h-full flex flex-col items-center">
      <h1 className="text-black md:text-4xl sm:text-xl mt-3 font-bold">
        Mini Game Management
      </h1>
      <div className="w-11/12 my-5 flex md:justify-end sm:justify-center items-center">
        <Button onClick={() => handleOpenCreateModal()} variant="contained" color="primary">
          Tạo Mini Games
        </Button>
      </div>

      <div className="text-black font-semibold md:text-xl sm:text-md w-11/12 my-5 flex md:justify-start sm:justify-center items-center">
        <p>Danh sách game đang chạy</p>
      </div>

      <CreateGameModal isOpen={isCreateModalOpen} onClose={handleCloseCreateModal} />
    </div>
  );
};

export default MiniGameManagement;
