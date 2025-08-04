"use client";
import { apiRequest, loginRequiredApi } from "@/lib/axiosInstance";
import React, { useEffect, useState, useRef } from "react";
import { ProductCard } from "../home/components/popularProduct/ProductCard";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

type SkinType = {
  _id: number;
  name: string;
};

type SkinStatus = {
  _id: number;
  name: string;
};

type QuizOption = {
  quizOption: {
    _id: string;
    content: string;
    quizQuestionId: string;
  };
  skinTypes: SkinType[];
  skinStatuses: SkinStatus[];
};

type QuizQuestion = {
  quizQuestion: {
    _id: string;
    content: string;
  };
  quizOptions: QuizOption[];
};

type ProductFromAPI = {
  product: {
    _id: string;
    categoryId: number;
    name: string;
    description: string;
    volume: number;
    salePrice: number;
    gameTicketReward: number;
    isDeactivated: true;
    createdAt: string;
    updatedAt: string;
    imageUrl: string;
  };
  category: {
    _id: number;
    name: string;
  };
  shipmentProducts: {
    shipment: {
      _id: string;
      shipmentDate: string;
      isDeleted: true;
      createdAt: string;
      updatedAt: string;
    };
    shipmentProduct: {
      _id: string;
      productId: string;
      shipmentId: string;
      importQuantity: number;
      saleQuantity: number;
      manufacturingDate: string;
      expiryDate: string;
      buyPrice: number;
      isDeactivated: true;
      createdAt: string;
      updatedAt: string;
    };
  }[];
  productSkinTypes: SkinType[];
  productSkinStatuses: SkinStatus[];
};

type FinalProductDetails = {
  product: {
    _id: string;
    categoryId: number;
    name: string;
    description: string;
    volume: number;
    salePrice: number;
    gameTicketReward: number;
    isDeactivated: boolean;
    createdAt: string;
    updatedAt: string;
    imageUrl: string;
  };
  category: {
    _id: number;
    name: string;
  };
  shipmentProducts: {
    shipment: {
      _id: string;
      shipmentDate: string;
      isDeleted: boolean;
      createdAt: string;
      updatedAt: string;
    };
    shipmentProduct: {
      _id: string;
      productId: string;
      shipmentId: string;
      importQuantity: number;
      saleQuantity: number;
      manufacturingDate: string;
      expiryDate: string;
      buyPrice: number;
      isDeactivated: boolean;
      createdAt: string;
      updatedAt: string;
    };
  }[];
  productSkinTypes: {
    _id: number;
    name: string;
  }[];
  productSkinStatuses: {
    _id: number;
    name: string;
  }[];
};

const QuizPage = () => {
  const [quizData, setQuizData] = useState<QuizQuestion[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: string;
  }>({});
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [customerSkinTypes, setCustomerSkinTypes] = useState<SkinType[]>([]);
  const [customerSkinStatuses, setCustomerSkinStatuses] = useState<
    SkinStatus[]
  >([]);
  const [suitableProducts, setSuitableProducts] = useState<
    FinalProductDetails[]
  >([]);

  // Ref to prevent double API calls in development mode
  const hasFetchedQuizData = useRef(false);

  // HOOKS
  useEffect(() => {
    if (!hasFetchedQuizData.current) {
      fetchQuizData();
      hasFetchedQuizData.current = true;
    }
  }, []);

  // FUNCTIONS
  const fetchQuizData = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest({
        instance: loginRequiredApi,
        method: "GET",
        url: "Quiz",
      });
      console.log("Quiz Data:", response.quizQuestions);
      setQuizData(response.quizQuestions);
    } catch (error) {
      console.error("Error fetching quiz data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionSelect = (questionId: string, optionId: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < (quizData?.length || 0) - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const canSubmit = () => {
    if (!quizData) return false;
    return quizData.every(
      (question) => selectedOptions[question.quizQuestion._id]
    );
  };

  const handleSubmitQuiz = async () => {
    if (!canSubmit()) return;

    setIsLoadingSubmit(true);
    try {
      const optionIds = Object.values(selectedOptions);
      const response = await apiRequest({
        instance: loginRequiredApi,
        method: "POST",
        url: "Quiz/result",
        data: {
          quizOptionIds: optionIds,
        },
      });

      if (response) {
        setCustomerSkinTypes(response.skinTypes);
        setCustomerSkinStatuses(response.skinStatuses);

        // Console log để debug
        console.log("Skin Types:", response.skinTypes);
        console.log("Skin Statuses:", response.skinStatuses);

        const recommendedProducts: ProductFromAPI[] =
          response.recommendedProducts;

        if (recommendedProducts && recommendedProducts.length > 0) {
          // Chỉ sử dụng products từ API response mà không cần extended info
          setSuitableProducts(recommendedProducts);
        }

        setIsQuizCompleted(true);
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  const handleRestartQuiz = () => {
    setIsQuizCompleted(false);
    setCurrentQuestionIndex(0);
    setSelectedOptions({});
    setCustomerSkinTypes([]);
    setCustomerSkinStatuses([]);
    setSuitableProducts([]);
    // Reset the ref to allow fetching quiz data again if needed
    hasFetchedQuizData.current = false;
  };
  const progress = quizData
    ? ((currentQuestionIndex + 1) / quizData.length) * 100
    : 0;
  const currentQuestion = quizData ? quizData[currentQuestionIndex] : null;

  // Quiz completed view
  if (isQuizCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
            <Link className="hover:underline" href={"/home"}>
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Quiz</span>
          </nav>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Desiki Quiz
            </h1>

            <div className="mb-8">
              <div className="flex justify-between items-start mb-4">
                <p className="text-gray-600 italic">
                  After review your quiz, we assumed that
                </p>
                <Button
                  onClick={handleRestartQuiz}
                  variant="outline"
                  className="px-4 py-2"
                >
                  Làm Quiz lại
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-gray-700 font-medium">
                    Your skin types are:{" "}
                  </span>
                  <div className="inline-flex gap-2 mt-1">
                    {customerSkinTypes.map((type, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {type.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-gray-700 font-medium">
                    Your skin statuses are:{" "}
                  </span>
                  <div className="inline-flex gap-2 mt-1">
                    {customerSkinStatuses.map((status, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                      >
                        {status.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Suitable Products
              </h2>
              {suitableProducts.length > 0 ? (
                <div className="grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-6">
                  {suitableProducts.map((item, index) => (
                    <div
                      key={`product-${item.product._id}-${index}`}
                      className="flex justify-center"
                    >
                      <ProductCard
                        product={{
                          _id: item.product._id,
                          categoryId: item.product.categoryId,
                          name: item.product.name,
                          description: item.product.description,
                          volume: item.product.volume,
                          salePrice: item.product.salePrice,
                          gameTicketReward: item.product.gameTicketReward,
                          isDeactivated: item.product.isDeactivated,
                          createdAt: item.product.createdAt,
                          updatedAt: item.product.updatedAt,
                          imageUrl: item.product.imageUrl,
                        }}
                        category={item.category}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No suitable products found for your skin type.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <span>Home</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Quiz</span>
        </nav>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Desiki Quiz</h1>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Progress</span>
              <span className="text-sm font-medium text-gray-900">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            </div>
          ) : currentQuestion ? (
            <div className="space-y-6">
              {/* Question */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Question {currentQuestionIndex + 1}/{quizData?.length}:
                </h2>
                <p className="text-gray-700">
                  {currentQuestion.quizQuestion.content}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.quizOptions.map((option) => (
                  <button
                    key={option.quizOption._id}
                    onClick={() =>
                      handleOptionSelect(
                        currentQuestion.quizQuestion._id,
                        option.quizOption._id
                      )
                    }
                    className={`w-full p-4 text-left border rounded-lg transition-all duration-200 ${
                      selectedOptions[currentQuestion.quizQuestion._id] ===
                      option.quizOption._id
                        ? "border-blue-500 bg-blue-50 text-blue-900"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {option.quizOption.content}
                  </button>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className="px-6"
                >
                  Previous
                </Button>

                {currentQuestionIndex === (quizData?.length || 0) - 1 ? (
                  <Button
                    onClick={handleSubmitQuiz}
                    disabled={!canSubmit() || isLoadingSubmit}
                    className="px-8 bg-blue-600 hover:bg-blue-700"
                  >
                    {isLoadingSubmit
                      ? "Checking Your Skin Type and Skin Statuses ..."
                      : "Submit Quiz"}
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    disabled={
                      !selectedOptions[currentQuestion.quizQuestion._id]
                    }
                    className="px-6 bg-blue-600 hover:bg-blue-700"
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No quiz questions available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
