import { callAPIAdmin } from "@/api/axiosInstace";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  CircularProgress,
  Button,
  Modal,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  OutlinedInput,
} from "@mui/material";
import {
  Edit,
  Delete,
  Add,
  Quiz,
  HelpOutline,
  CheckCircle,
} from "@mui/icons-material";
import "@/styles/ag-grid-glassmophorism.css"; // Import glassmorphism CSS
import "./styles.css";

type QuizQuestion = {
  quizQuestion: {
    _id: string;
    content: string;
  };
  quizOptions:
    | {
        quizOption: {
          _id: string;
          content: string;
          quizQuestionId: string;
        };
        skinTypes: {
          _id: number;
          name: string;
        }[];
        skinStatuses: {
          _id: number;
          name: string;
        }[];
      }[]
    | [];
};

type SkinType = {
  _id: number;
  name: string;
};

type SkinStatus = {
  _id: number;
  name: string;
};

// Custom Glassmorphism Chip Component
const GlassChip = ({
  label,
  variant = "default",
}: {
  label: string;
  variant?: "success" | "error" | "warning" | "primary" | "default";
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return "bg-emerald-500/20 border-emerald-400/40 text-emerald-100";
      case "error":
        return "bg-red-500/20 border-red-400/40 text-red-100";
      case "warning":
        return "bg-amber-500/20 border-amber-400/40 text-amber-100";
      case "primary":
        return "bg-blue-500/20 border-blue-400/40 text-blue-100";
      default:
        return "bg-slate-500/20 border-slate-400/40 text-slate-100";
    }
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${getVariantStyles()}`}
    >
      {label}
    </span>
  );
};

const QuizManagement = () => {
  // STATES
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [skinTypes, setSkinTypes] = useState<SkinType[]>([]);
  const [skinStatuses, setSkinStatuses] = useState<SkinStatus[]>([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    null
  );
  const [newQuestionContent, setNewQuestionContent] = useState("");
  const [newOptionContent, setNewOptionContent] = useState("");
  const [selectedSkinTypeIds, setSelectedSkinTypeIds] = useState<number[]>([]);
  const [selectedSkinStatusIds, setSelectedSkinStatusIds] = useState<number[]>(
    []
  );

  // Modal states
  const [isCreateQuestionModalOpen, setIsCreateQuestionModalOpen] =
    useState(false);
  const [isEditQuestionModalOpen, setIsEditQuestionModalOpen] = useState(false);
  const [isCreateOptionModalOpen, setIsCreateOptionModalOpen] = useState(false);
  const [isEditOptionModalOpen, setIsEditOptionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(
    null
  );
  const [editingOption, setEditingOption] = useState<any>(null);
  const [editingOptionContent, setEditingOptionContent] = useState("");
  const [editingQuestionContent, setEditingQuestionContent] = useState("");

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);

  // EFFECTS
  useEffect(() => {
    fetchAll();
  }, []);

  // FUNCTIONS
  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const response = await callAPIAdmin({
        method: "GET",
        url: `/api/Quiz`,
      });
      if (response && response.status === 200) {
        setQuizQuestions(response.data.quizQuestions);
        // Call API to get skin types and statuses
        const skinTypesResponse = await callAPIAdmin({
          method: "GET",
          url: `/api/Product/skinTypes`,
        });
        const skinStatusesResponse = await callAPIAdmin({
          method: "GET",
          url: `/api/Product/skinStatuses`,
        });
        if (
          skinTypesResponse &&
          skinTypesResponse.status === 200 &&
          skinStatusesResponse &&
          skinStatusesResponse.status === 200
        ) {
          setSkinTypes(skinTypesResponse.data.skinTypes);
          setSkinStatuses(skinStatusesResponse.data.skinStatuses);
        } else {
          console.error("Failed to fetch skin types or statuses");
        }
      } else {
        console.error("Failed to fetch quiz questions:", response);
      }
    } catch (error) {
      console.error("Error fetching quiz questions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewQuizQuestion = async (content: string) => {
    setIsSaveLoading(true);
    try {
      const response = await callAPIAdmin({
        method: "POST",
        url: `/api/Quiz/questions`,
        data: {
          quizQuestion: {
            content: content,
          },
        },
      });
      if (response && response.status === 201) {
        // Close modal and reset form first
        setIsCreateQuestionModalOpen(false);
        setNewQuestionContent("");
        setIsSaveLoading(false);

        // Then show success message and refresh data
        Swal.fire({
          title: "Success",
          text: "Quiz question created successfully!",
          icon: "success",
        });
        await fetchAll();
        console.log("Quiz question created successfully:", response.data);
      } else {
        console.error("Failed to create quiz question:", response);
        setIsSaveLoading(false);
      }
    } catch (error) {
      console.error("Error creating quiz question:", error);
      setIsSaveLoading(false);
    }
  };

  const editQuizQuestion = async (questionId: string, newContent: string) => {
    setIsSaveLoading(true);
    try {
      const response = await callAPIAdmin({
        method: "PUT",
        url: `/api/Quiz/questions/${questionId}`,
        data: {
          quizQuestion: {
            content: newContent,
          },
        },
      });
      if (response && response.status === 200) {
        // Close modal and reset form first
        setIsEditQuestionModalOpen(false);
        setEditingQuestion(null);
        setEditingQuestionContent("");
        setIsSaveLoading(false);

        // Then show success message and refresh data
        Swal.fire({
          title: "Success",
          text: "Quiz question updated successfully!",
          icon: "success",
        });
        await fetchAll();
        console.log("Quiz question updated successfully:", response.data);
      } else {
        console.error("Failed to update quiz question:", response);
        setIsSaveLoading(false);
      }
    } catch (error) {
      console.error("Error updating quiz question:", error);
      setIsSaveLoading(false);
    }
  };

  const deleteQuizQuestion = async (questionId: string) => {
    try {
      const response = await callAPIAdmin({
        method: "DELETE",
        url: `/api/Quiz/questions/${questionId}`,
      });
      if (response && response.status === 200) {
        Swal.fire({
          title: "Success",
          text: "Quiz question deleted successfully!",
          icon: "success",
        });
        await fetchAll();
        console.log("Quiz question deleted successfully:", response.data);
      } else {
        console.error("Failed to delete quiz question:", response);
      }
    } catch (error) {
      console.error("Error deleting quiz question:", error);
    }
  };

  const createNewQuizQuestionOption = async (
    questionId: string,
    content: string,
    skinTypeIds: number[],
    skinStatusIds: number[]
  ) => {
    setIsSaveLoading(true);
    try {
      const response = await callAPIAdmin({
        method: "POST",
        url: `/api/Quiz/questions/${questionId}/options`,
        data: {
          quizOption: {
            content: content,
          },
          skinTypeIds: skinTypeIds,
          skinStatusIds: skinStatusIds,
        },
      });
      if (response && response.status === 201) {
        // Close modal and reset form first
        setIsCreateOptionModalOpen(false);
        setNewOptionContent("");
        setSelectedSkinTypeIds([]);
        setSelectedSkinStatusIds([]);
        setSelectedQuestionId(null);
        setIsSaveLoading(false);

        // Then show success message and refresh data
        Swal.fire({
          title: "Success",
          text: "Quiz option created successfully!",
          icon: "success",
        });
        await fetchAll();
        console.log("Quiz option created successfully:", response.data);
      } else {
        console.error("Failed to create quiz option:", response);
        setIsSaveLoading(false);
      }
    } catch (error) {
      console.error("Error creating quiz option:", error);
      setIsSaveLoading(false);
    }
  };

  const upadateQuizQuestionOption = async (
    optionId: string,
    newContent: string,
    skinTypeIds: number[],
    skinStatusIds: number[]
  ) => {
    setIsSaveLoading(true);
    try {
      const response = await callAPIAdmin({
        method: "PUT",
        url: `/api/Quiz/options/${optionId}`,
        data: {
          quizOption: {
            content: newContent,
          },
          skinTypeIds: skinTypeIds,
          skinStatusIds: skinStatusIds,
        },
      });
      if (response && response.status === 200) {
        // Close modal and reset form first
        setIsEditOptionModalOpen(false);
        setEditingOption(null);
        setEditingOptionContent("");
        setSelectedSkinTypeIds([]);
        setSelectedSkinStatusIds([]);
        setIsSaveLoading(false);

        // Then show success message and refresh data
        Swal.fire({
          title: "Success",
          text: "Quiz option updated successfully!",
          icon: "success",
        });
        await fetchAll();
        console.log("Quiz option updated successfully:", response.data);
      } else {
        console.error("Failed to update quiz option:", response);
        setIsSaveLoading(false);
      }
    } catch (error) {
      console.error("Error updating quiz option:", error);
      setIsSaveLoading(false);
    }
  };
  const deleteQuizQuestionOption = async (optionId: string) => {
    try {
      const response = await callAPIAdmin({
        method: "DELETE",
        url: `/api/Quiz/options/${optionId}`,
      });
      if (response && response.status === 200) {
        Swal.fire({
          title: "Success",
          text: "Quiz option deleted successfully!",
          icon: "success",
        });
        await fetchAll();
        console.log("Quiz option deleted successfully:", response.data);
      } else {
        console.error("Failed to delete quiz option:", response);
      }
    } catch (error) {
      console.error("Error deleting quiz option:", error);
    }
  };

  // Handler functions
  const handleCreateQuestion = () => {
    setNewQuestionContent("");
    setIsCreateQuestionModalOpen(true);
  };

  const handleEditQuestion = (question: QuizQuestion) => {
    setEditingQuestion(question);
    setEditingQuestionContent(question.quizQuestion.content);
    setIsEditQuestionModalOpen(true);
  };

  const handleCreateOption = (questionId: string) => {
    setSelectedQuestionId(questionId);
    setNewOptionContent("");
    setSelectedSkinTypeIds([]);
    setSelectedSkinStatusIds([]);
    setIsCreateOptionModalOpen(true);
  };

  const handleEditOption = (option: any) => {
    setEditingOption(option);
    setEditingOptionContent(option.quizOption.content);
    setSelectedSkinTypeIds(option.skinTypes.map((st: any) => st._id));
    setSelectedSkinStatusIds(option.skinStatuses.map((ss: any) => ss._id));
    setIsEditOptionModalOpen(true);
  };

  const handleDeleteQuestion = async (questionId: string) => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn?",
      text: "Hành động này sẽ xóa câu hỏi và tất cả các lựa chọn liên quan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Có, xóa!",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      await deleteQuizQuestion(questionId);
    }
  };

  const handleDeleteOption = async (optionId: string) => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn?",
      text: "Hành động này sẽ xóa lựa chọn này!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Có, xóa!",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      await deleteQuizQuestionOption(optionId);
    }
  };

  return (
    <div className="w-full flex flex-col p-0">
      {/* Header Section */}
      <div className="mb-8 backdrop-blur-xl bg-gray-400/20 border border-white/10 rounded-2xl p-6 shadow-2xl">
        <h1 className="text-white text-3xl font-bold mb-2">
          Quản lý Quiz Skincare
        </h1>
        <p className="text-white/70 text-lg">
          Quản lý câu hỏi và lựa chọn cho quiz tư vấn skincare
        </p>
      </div>

      {/* Quiz Questions Section */}
      <div className="backdrop-blur-xl bg-gray-400/20 border border-white/10 rounded-2xl shadow-2xl">
        <div className="p-6 border-b border-white/10">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Quiz className="text-purple-300" />
              <h2 className="text-xl font-semibold text-white">Câu hỏi Quiz</h2>
            </div>
            <button
              onClick={handleCreateQuestion}
              className="px-4 py-2 bg-purple-500/20 border border-purple-400/40 text-purple-200 hover:bg-purple-500/30 transition-all duration-200 backdrop-blur-sm rounded-lg text-sm font-medium shadow-lg flex items-center gap-2"
            >
              <Add className="text-sm" />
              Thêm câu hỏi
            </button>
          </div>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <CircularProgress className="text-white" />
            </div>
          ) : quizQuestions.length === 0 ? (
            <div className="text-center py-8">
              <Quiz className="mx-auto mb-4 text-4xl text-white/30" />
              <p className="text-white/70">Chưa có câu hỏi nào</p>
            </div>
          ) : (
            <div className="space-y-6">
              {quizQuestions.map((question, questionIndex) => (
                <div
                  key={question.quizQuestion._id}
                  className="backdrop-blur-xl bg-gray-500/10 border border-white/10 rounded-xl p-6"
                >
                  {/* Question Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <HelpOutline className="text-purple-300 text-sm" />
                        <span className="text-purple-200 text-xl font-medium">
                          Câu hỏi #{questionIndex + 1}
                        </span>
                      </div>
                      <p className="text-white text-lg font-medium">
                        {question.quizQuestion.content}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEditQuestion(question)}
                        className="p-2 bg-blue-500/20 border border-blue-400/40 text-blue-200 hover:bg-blue-500/30 transition-all duration-200 backdrop-blur-sm rounded-lg"
                      >
                        <Edit className="text-sm" />
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteQuestion(question.quizQuestion._id)
                        }
                        className="p-2 bg-red-500/20 border border-red-400/40 text-red-200 hover:bg-red-500/30 transition-all duration-200 backdrop-blur-sm rounded-lg"
                      >
                        <Delete className="text-sm" />
                      </button>
                    </div>
                  </div>

                  {/* Options Section */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-white/80 font-medium">
                        Các lựa chọn:
                      </h4>
                      <button
                        onClick={() =>
                          handleCreateOption(question.quizQuestion._id)
                        }
                        className="px-3 py-1 bg-green-500/20 border border-green-400/40 text-green-200 hover:bg-green-500/30 transition-all duration-200 backdrop-blur-sm rounded-lg text-sm flex items-center gap-1"
                      >
                        <Add className="text-xs" />
                        Thêm lựa chọn
                      </button>
                    </div>

                    {question.quizOptions.length === 0 ? (
                      <div className="text-center py-4 text-white/50">
                        Chưa có lựa chọn nào
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {question.quizOptions.map((option, optionIndex) => (
                          <div
                            key={option.quizOption._id}
                            className="backdrop-blur-xl bg-gray-600/10 border border-white/5 rounded-lg p-4"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-green-200 font-bold text-lg">
                                    Lựa chọn {optionIndex + 1}
                                  </span>
                                </div>
                                <div className="my-2 p-2 bg-white/40 rounded-md flex items-center justify-start">
                                  <p className="text-white/90 m-0">
                                    {option.quizOption.content}
                                  </p>
                                </div>

                                {/* Skin Types */}
                                <div className="mb-2">
                                  <span className="text-white/70 text-sm mb-1 block">
                                    Loại da tương ứng:
                                  </span>
                                  <div className="flex flex-wrap gap-1">
                                    {option.skinTypes.map((type) => (
                                      <GlassChip
                                        key={type._id}
                                        label={type.name}
                                        variant="primary"
                                      />
                                    ))}
                                  </div>
                                </div>

                                {/* Skin Statuses */}
                                <div>
                                  <span className="text-white/70 text-sm mb-1 block">
                                    Tình trạng da tương ứng:
                                  </span>
                                  <div className="flex flex-wrap gap-1">
                                    {option.skinStatuses.map((status) => (
                                      <GlassChip
                                        key={status._id}
                                        label={status.name}
                                        variant="warning"
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>

                              <div className="flex gap-2 ml-4">
                                <button
                                  onClick={() => handleEditOption(option)}
                                  className="p-2 bg-blue-500/20 border border-blue-400/40 text-blue-200 hover:bg-blue-500/30 transition-all duration-200 backdrop-blur-sm rounded-lg"
                                >
                                  <Edit className="text-sm" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteOption(option.quizOption._id)
                                  }
                                  className="p-2 bg-red-500/20 border border-red-400/40 text-red-200 hover:bg-red-500/30 transition-all duration-200 backdrop-blur-sm rounded-lg"
                                >
                                  <Delete className="text-sm" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Question Modal */}
      <Modal
        open={isCreateQuestionModalOpen}
        onClose={() => setIsCreateQuestionModalOpen(false)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            maxHeight: "90vh",
            overflow: "auto",
            gap: 5,
          }}
          className="backdrop-blur-xl bg-gray-400/20 border border-white/10 rounded-2xl p-6 shadow-2xl"
        >
          <Typography
            variant="h6"
            component="h2"
            className="text-white font-semibold mb-4"
          >
            Thêm câu hỏi mới
          </Typography>

          <div className="space-y-4">
            <TextField
              label="Nội dung câu hỏi"
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              value={newQuestionContent}
              onChange={(e) => setNewQuestionContent(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                  "&:hover fieldset": { borderColor: "rgba(255,255,255,0.5)" },
                  "&.Mui-focused fieldset": {
                    borderColor: "rgba(255,255,255,0.7)",
                  },
                },
                "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" },
              }}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                onClick={() => setIsCreateQuestionModalOpen(false)}
                className="text-white/70 border-white/30"
                variant="outlined"
              >
                Hủy
              </Button>
              <Button
                onClick={() => createNewQuizQuestion(newQuestionContent)}
                disabled={!newQuestionContent.trim() || isSaveLoading}
                className="bg-purple-500/20 border-purple-400/40 text-purple-200"
                variant="outlined"
              >
                {isSaveLoading ? (
                  <>
                    <CircularProgress size={16} className="mr-2" />
                    Đang tạo...
                  </>
                ) : (
                  "Tạo câu hỏi"
                )}
              </Button>
            </div>
          </div>
        </Box>
      </Modal>

      {/* Edit Question Modal */}
      <Modal
        open={isEditQuestionModalOpen}
        onClose={() => setIsEditQuestionModalOpen(false)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            maxHeight: "90vh",
            overflow: "auto",
            gap: 5,
          }}
          className="backdrop-blur-xl bg-gray-400/20 border border-white/10 rounded-2xl p-6 shadow-2xl"
        >
          <Typography
            variant="h6"
            component="h2"
            className="text-white font-semibold mb-4"
          >
            Chỉnh sửa câu hỏi
          </Typography>

          <div className="space-y-4">
            <TextField
              label="Nội dung câu hỏi"
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              value={editingQuestionContent}
              onChange={(e) => setEditingQuestionContent(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                  "&:hover fieldset": { borderColor: "rgba(255,255,255,0.5)" },
                  "&.Mui-focused fieldset": {
                    borderColor: "rgba(255,255,255,0.7)",
                  },
                },
                "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" },
              }}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                onClick={() => setIsEditQuestionModalOpen(false)}
                className="text-white/70 border-white/30"
                variant="outlined"
              >
                Hủy
              </Button>
              <Button
                onClick={() =>
                  editQuizQuestion(
                    editingQuestion?.quizQuestion._id || "",
                    editingQuestionContent
                  )
                }
                disabled={!editingQuestionContent.trim() || isSaveLoading}
                className="bg-blue-500/20 border-blue-400/40 text-blue-200"
                variant="outlined"
              >
                {isSaveLoading ? (
                  <>
                    <CircularProgress size={16} className="mr-2" />
                    Đang lưu...
                  </>
                ) : (
                  "Lưu thay đổi"
                )}
              </Button>
            </div>
          </div>
        </Box>
      </Modal>

      {/* Create Option Modal */}
      <Modal
        open={isCreateOptionModalOpen}
        onClose={() => setIsCreateOptionModalOpen(false)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            maxHeight: "90vh",
            overflow: "auto",
          }}
          className="backdrop-blur-xl bg-gray-400/20 border border-white/10 rounded-2xl p-6 shadow-2xl"
        >
          <Typography
            variant="h6"
            component="h2"
            className="text-white font-semibold mb-4"
          >
            Thêm lựa chọn mới
          </Typography>

          <div className="space-y-4">
            <TextField
              label="Nội dung lựa chọn"
              variant="outlined"
              fullWidth
              multiline
              rows={2}
              value={newOptionContent}
              onChange={(e) => setNewOptionContent(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                  "&:hover fieldset": { borderColor: "rgba(255,255,255,0.5)" },
                  "&.Mui-focused fieldset": {
                    borderColor: "rgba(255,255,255,0.7)",
                  },
                },
                "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" },
              }}
            />

            <FormControl sx={{ marginTop: 2 }} fullWidth>
              <InputLabel sx={{ color: "rgba(255,255,255,0.7)" }}>
                Loại da
              </InputLabel>
              <Select
                multiple
                value={selectedSkinTypeIds}
                onChange={(e) =>
                  setSelectedSkinTypeIds(e.target.value as number[])
                }
                input={<OutlinedInput label="Loại da" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => {
                      const skinType = skinTypes.find((st) => st._id === value);
                      return (
                        <Chip
                          key={value}
                          label={skinType?.name}
                          size="small"
                          sx={{
                            backgroundColor: "rgba(59, 130, 246, 0.2)",
                            color: "rgb(147, 197, 253)",
                            border: "1px solid rgba(59, 130, 246, 0.4)",
                          }}
                        />
                      );
                    })}
                  </Box>
                )}
                sx={{
                  color: "white",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,255,255,0.3)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,255,255,0.5)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,255,255,0.7)",
                  },
                }}
              >
                {skinTypes.map((skinType) => (
                  <MenuItem key={skinType._id} value={skinType._id}>
                    {skinType.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ marginTop: 2 }} fullWidth>
              <InputLabel sx={{ color: "rgba(255,255,255,0.7)" }}>
                Tình trạng da
              </InputLabel>
              <Select
                multiple
                value={selectedSkinStatusIds}
                onChange={(e) =>
                  setSelectedSkinStatusIds(e.target.value as number[])
                }
                input={<OutlinedInput label="Tình trạng da" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => {
                      const skinStatus = skinStatuses.find(
                        (ss) => ss._id === value
                      );
                      return (
                        <Chip
                          key={value}
                          label={skinStatus?.name}
                          size="small"
                          sx={{
                            backgroundColor: "rgba(245, 158, 11, 0.2)",
                            color: "rgb(252, 211, 77)",
                            border: "1px solid rgba(245, 158, 11, 0.4)",
                          }}
                        />
                      );
                    })}
                  </Box>
                )}
                sx={{
                  color: "white",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,255,255,0.3)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,255,255,0.5)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,255,255,0.7)",
                  },
                }}
              >
                {skinStatuses.map((skinStatus) => (
                  <MenuItem key={skinStatus._id} value={skinStatus._id}>
                    {skinStatus.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                onClick={() => setIsCreateOptionModalOpen(false)}
                className="text-white/70 border-white/30"
                variant="outlined"
              >
                Hủy
              </Button>
              <Button
                onClick={() =>
                  createNewQuizQuestionOption(
                    selectedQuestionId || "",
                    newOptionContent,
                    selectedSkinTypeIds,
                    selectedSkinStatusIds
                  )
                }
                disabled={
                  !newOptionContent.trim() ||
                  selectedSkinTypeIds.length === 0 ||
                  selectedSkinStatusIds.length === 0 ||
                  isSaveLoading
                }
                className="bg-green-500/20 border-green-400/40 text-green-200"
                variant="outlined"
              >
                {isSaveLoading ? (
                  <>
                    <CircularProgress size={16} className="mr-2" />
                    Đang tạo...
                  </>
                ) : (
                  "Tạo lựa chọn"
                )}
              </Button>
            </div>
          </div>
        </Box>
      </Modal>

      {/* Edit Option Modal */}
      <Modal
        open={isEditOptionModalOpen}
        onClose={() => setIsEditOptionModalOpen(false)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            maxHeight: "90vh",
            overflow: "auto",
          }}
          className="backdrop-blur-xl bg-gray-400/20 border border-white/10 rounded-2xl p-6 shadow-2xl"
        >
          <Typography
            variant="h6"
            component="h2"
            className="text-white font-semibold mb-4"
          >
            Chỉnh sửa lựa chọn
          </Typography>

          <div className="space-y-4">
            <TextField
              label="Nội dung lựa chọn"
              variant="outlined"
              fullWidth
              multiline
              rows={2}
              value={editingOptionContent}
              onChange={(e) => setEditingOptionContent(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                  "&:hover fieldset": { borderColor: "rgba(255,255,255,0.5)" },
                  "&.Mui-focused fieldset": {
                    borderColor: "rgba(255,255,255,0.7)",
                  },
                },
                "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" },
              }}
            />

            <FormControl sx={{ marginTop: 2 }} fullWidth>
              <InputLabel sx={{ color: "rgba(255,255,255,0.7)" }}>
                Loại da
              </InputLabel>
              <Select
                multiple
                value={selectedSkinTypeIds}
                onChange={(e) =>
                  setSelectedSkinTypeIds(e.target.value as number[])
                }
                input={<OutlinedInput label="Loại da" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => {
                      const skinType = skinTypes.find((st) => st._id === value);
                      return (
                        <Chip
                          key={value}
                          label={skinType?.name}
                          size="small"
                          sx={{
                            backgroundColor: "rgba(59, 130, 246, 0.2)",
                            color: "rgb(147, 197, 253)",
                            border: "1px solid rgba(59, 130, 246, 0.4)",
                          }}
                        />
                      );
                    })}
                  </Box>
                )}
                sx={{
                  color: "white",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,255,255,0.3)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,255,255,0.5)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,255,255,0.7)",
                  },
                }}
              >
                {skinTypes.map((skinType) => (
                  <MenuItem key={skinType._id} value={skinType._id}>
                    {skinType.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ marginTop: 2 }} fullWidth>
              <InputLabel sx={{ color: "rgba(255,255,255,0.7)" }}>
                Tình trạng da
              </InputLabel>
              <Select
                multiple
                value={selectedSkinStatusIds}
                onChange={(e) =>
                  setSelectedSkinStatusIds(e.target.value as number[])
                }
                input={<OutlinedInput label="Tình trạng da" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => {
                      const skinStatus = skinStatuses.find(
                        (ss) => ss._id === value
                      );
                      return (
                        <Chip
                          key={value}
                          label={skinStatus?.name}
                          size="small"
                          sx={{
                            backgroundColor: "rgba(245, 158, 11, 0.2)",
                            color: "rgb(252, 211, 77)",
                            border: "1px solid rgba(245, 158, 11, 0.4)",
                          }}
                        />
                      );
                    })}
                  </Box>
                )}
                sx={{
                  color: "white",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,255,255,0.3)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,255,255,0.5)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,255,255,0.7)",
                  },
                }}
              >
                {skinStatuses.map((skinStatus) => (
                  <MenuItem key={skinStatus._id} value={skinStatus._id}>
                    {skinStatus.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                onClick={() => setIsEditOptionModalOpen(false)}
                className="text-white/70 border-white/30"
                variant="outlined"
              >
                Hủy
              </Button>
              <Button
                onClick={() =>
                  upadateQuizQuestionOption(
                    editingOption?.quizOption._id || "",
                    editingOptionContent,
                    selectedSkinTypeIds,
                    selectedSkinStatusIds
                  )
                }
                disabled={
                  !editingOptionContent.trim() ||
                  selectedSkinTypeIds.length === 0 ||
                  selectedSkinStatusIds.length === 0 ||
                  isSaveLoading
                }
                className="bg-blue-500/20 border-blue-400/40 text-blue-200"
                variant="outlined"
              >
                {isSaveLoading ? (
                  <>
                    <CircularProgress size={16} className="mr-2" />
                    Đang lưu...
                  </>
                ) : (
                  "Lưu thay đổi"
                )}
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default QuizManagement;
