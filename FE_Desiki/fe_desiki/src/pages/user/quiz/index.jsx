import { useState, useEffect } from "react";
import {
  Button,
  Progress,
  Card,
  Typography,
  Tag,
  Spin,
  message,
  Radio,
} from "antd";
import { CheckCircleOutlined, ReloadOutlined } from "@ant-design/icons";
import styles from "./Quiz.module.css";
import { getQuiz, submitQuiz } from "../../../services/apiServices";
import ProductCard from "../../../components/HomePage/ProductCard/ProductCard";

const { Title, Text, Paragraph } = Typography;

const QuizPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [quizData, setQuizData] = useState([]);
  const [selectedOptionIds, setSelectedOptionIds] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [customerSkinTypes, setCustomerSkinTypes] = useState([]);
  const [customerSkinStatuses, setCustomerSkinStatuses] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  useEffect(() => {
    fetchQuizData();
  }, []);

  // FUNCTIONS
  const fetchQuizData = async () => {
    try {
      setIsLoading(true);
      const response = await getQuiz();
      if (response) {
        setQuizData(response);
        // Initialize selectedOptionIds array with nulls for each question
        setSelectedOptionIds(new Array(response.length).fill(null));
      }
    } catch (error) {
      console.log("Error fetching quiz data: ", error);
      message.error("Có lỗi xảy ra khi tải câu hỏi!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionSelect = (questionIndex, optionId) => {
    const newSelectedOptionIds = [...selectedOptionIds];
    newSelectedOptionIds[questionIndex] = optionId;
    setSelectedOptionIds(newSelectedOptionIds);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const canGoNext = () => {
    return selectedOptionIds[currentQuestionIndex] !== null;
  };

  const isQuizComplete = () => {
    return selectedOptionIds.every((option) => option !== null);
  };

  const handleSubmitQuiz = async () => {
    if (!isQuizComplete()) {
      message.warning("Vui lòng trả lời tất cả các câu hỏi!");
      return;
    }

    try {
      setIsSubmitting(true);
      // Filter out null values and submit only selected option IDs
      const validOptionIds = selectedOptionIds.filter((id) => id !== null);
      const response = await submitQuiz(validOptionIds);
      if (response) {
        // Handle successful quiz submission
        setCustomerSkinTypes(response.skinTypes);
        setCustomerSkinStatuses(response.skinStatuses);
        setRecommendedProducts(response.recommendedProducts);
        setIsQuizSubmitted(true);
        message.success("Hoàn thành quiz thành công!");
      }
    } catch (error) {
      console.log("Error submitting quiz: ", error);
      message.error("Có lỗi xảy ra khi nộp bài quiz!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetQuiz = () => {
    setSelectedOptionIds(new Array(quizData.length).fill(null));
    setCurrentQuestionIndex(0);
    setIsQuizSubmitted(false);
    setCustomerSkinTypes([]);
    setCustomerSkinStatuses([]);
    setRecommendedProducts([]);
    message.info("Đã reset quiz!");
  };

  if (isLoading) {
    return (
      <div className={styles.quizLoading}>
        <Spin size="large" />
        <Text style={{ marginTop: 16 }}>Đang tải câu hỏi...</Text>
      </div>
    );
  }

  if (isQuizSubmitted) {
    return (
      <div className={styles.quizResults}>
        <div className={styles.resultsHeader}>
          <CheckCircleOutlined className={styles.successIcon} />
          <Title level={2}>Kết quả Quiz của bạn</Title>
        </div>

        <div className={styles.resultsContent}>
          {/* Skin Types */}
          <Card className={styles.resultCard} title="Loại da của bạn">
            <div className={styles.skinTags}>
              {customerSkinTypes.map((skinType) => (
                <Tag key={skinType._id} color="blue" className={styles.skinTag}>
                  {skinType.name}
                </Tag>
              ))}
            </div>
          </Card>

          {/* Skin Statuses */}
          <Card className={styles.resultCard} title="Tình trạng da của bạn">
            <div className={styles.skinTags}>
              {customerSkinStatuses.map((skinStatus) => (
                <Tag
                  key={skinStatus._id}
                  color="green"
                  className={styles.skinTag}
                >
                  {skinStatus.name}
                </Tag>
              ))}
            </div>
          </Card>

          {/* Recommended Products */}
          <Card className={styles.resultCard} title="Sản phẩm phù hợp với bạn">
            <div className={styles.recommendedProducts}>
              {recommendedProducts.length > 0 ? (
                recommendedProducts.map((product, index) => (
                  <ProductCard
                    key={product.product._id || index}
                    product={product}
                  />
                ))
              ) : (
                <Text>Không có sản phẩm phù hợp được tìm thấy.</Text>
              )}
            </div>
          </Card>
        </div>

        <div className={styles.resultsActions}>
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={handleResetQuiz}
            size="large"
          >
            Làm lại Quiz
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = quizData[currentQuestionIndex];
  const progressPercent = ((currentQuestionIndex + 1) / quizData.length) * 100;

  return (
    <div className={styles.quizContainer}>
      <div className={styles.quizHeader}>
        <Title level={2}>Quiz Tìm Hiểu Loại Da</Title>
        <Text className={styles.quizSubtitle}>
          Trả lời các câu hỏi để tìm hiểu loại da và nhận gợi ý sản phẩm phù hợp
        </Text>
      </div>

      {/* Progress Bar */}
      <div className={styles.quizProgress}>
        <Progress
          percent={progressPercent}
          strokeColor={{
            "0%": "#108ee9",
            "100%": "#87d068",
          }}
          className={styles.progressBar}
        />
        <Text className={styles.progressText}>
          Câu {currentQuestionIndex + 1} / {quizData.length}
        </Text>
      </div>

      {/* Question Card */}
      <Card className={styles.questionCard}>
        <Title level={3} className={styles.questionTitle}>
          {currentQuestion?.quizQuestion?.content}
        </Title>

        <div className={styles.optionsContainer}>
          <Radio.Group
            value={selectedOptionIds[currentQuestionIndex]}
            onChange={(e) =>
              handleOptionSelect(currentQuestionIndex, e.target.value)
            }
          >
            {currentQuestion?.quizOptions?.map((option, index) => (
              <Radio
                key={option.quizOption._id}
                value={option.quizOption._id}
                className={styles.radioOption}
              >
                <span className={styles.optionText}>
                  {option.quizOption.content}
                </span>
              </Radio>
            ))}
          </Radio.Group>
        </div>

        {/* Navigation - positioned at bottom right of card */}
        <div className={styles.cardNavigation}>
          <div className={styles.navigationButtons}>
            <Button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              size="large"
            >
              Quay lại
            </Button>

            {currentQuestionIndex === quizData.length - 1 &&
            isQuizComplete() ? (
              <Button
                type="primary"
                onClick={handleSubmitQuiz}
                loading={isSubmitting}
                size="large"
              >
                Hoàn thành Quiz
              </Button>
            ) : (
              <Button
                type="primary"
                onClick={handleNextQuestion}
                disabled={!canGoNext()}
                size="large"
              >
                Câu tiếp theo
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Reset Button - separate from navigation */}
      <div className={styles.resetSection}>
        <Button onClick={handleResetQuiz} type="default" size="large">
          Làm lại từ đầu
        </Button>
      </div>
    </div>
  );
};

export default QuizPage;
