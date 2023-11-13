"use client";

import {
  getSynonymsBlock,
  getSynonymsSuggestions,
} from "@/services/project-service";
import {
  SynonymBlockRequest,
  SynonymBlockResponse,
  SynonymSuggestionRequest,
} from "@/types/synonyms-types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { use, useEffect, useState } from "react";
interface secondStepProps {
  userId: string;
  projectId: string | undefined;
}
const SecondStep: React.FC<secondStepProps> = ({ userId, projectId }) => {
  // array of conditions. Coming from synonyms block
  const [conditions, setConditions] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const [condition, setCondition] = useState(true);
  const [dropDownArrow, setDropDownArrow] = useState(false);
  // search param to get suggestions
  const [searchCondition, setSearchCondition] = useState<string>("");
  // search param to get synonym block
  const [blockSearchCondition, setBlockSearchCondition] = useState<
    string | null
  >();
  // enable or disable fetch synonym block
  const [getBlock, setGetBlock] = useState<boolean>(false);

  // Index of the suggestion that is selected (on arrow or on hovering)
  const [selectedSuggestion, setSelectedSuggestion] = useState<number>(-1);
  // Suggestion array from AI
  const [suggestions, setSuggestions] = useState<string[]>([]);
  // synonym Block
  const [conditionBlock, setConditionBlock] =
    useState<SynonymBlockResponse | null>();
  // Search query params to get suggestions
  const searchQueryParams: SynonymSuggestionRequest = {
    userId: userId,
    projectId: projectId ? projectId : "",
    search: searchCondition,
  };
  // Search query params to get synonym block
  const searchQueryParamsBlock: SynonymBlockRequest = {
    userId: userId,
    projectId: projectId ? projectId : "",
    searchCondition: blockSearchCondition ? blockSearchCondition : "",
  };
  // fetch function to get synonyms block
  const {
    status: blockStatus,
    data: blockData,
    error: blockError,
  } = useQuery({
    queryKey: ["synonymBlock", searchQueryParamsBlock],
    queryFn: () => getSynonymsBlock(searchQueryParamsBlock),
    enabled: getBlock,
  });
  // set query params for block and i fata is available save it to the states
  useEffect(() => {
    searchQueryParamsBlock.searchCondition = blockSearchCondition
      ? blockSearchCondition
      : "";
    blockData && setConditionBlock(blockData);
    if (conditionBlock && blockData) {
      setGetBlock(false);
      setConditions(Object.keys(blockData));
    }
  }, [searchCondition, blockData, conditionBlock]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key == "ArrowDown" && selectedSuggestion < 4) {
      // Move selection down
      setSelectedSuggestion(selectedSuggestion + 1);
    }
  };
  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key == "ArrowUp" && selectedSuggestion > 0) {
      // Move selection up
      setSelectedSuggestion(selectedSuggestion - 1);
    }
  };

  // On enter save condition to search (to get block)
  const handleKeyEnter = (e: KeyboardEvent) => {
    if (e.key == "Enter") {
      setBlockSearchCondition(suggestions[selectedSuggestion]);
      setSearchCondition(suggestions[selectedSuggestion]);
      setGetBlock(true);
      setSearchCondition("");
    }
  };
  useEffect(() => {
    window.addEventListener("keyup", handleKeyDown);
    window.addEventListener("keyup", handleKeyEnter);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keyup", handleKeyDown);
      window.removeEventListener("keyup", handleKeyEnter);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [selectedSuggestion]);
  // fetch suggestions
  const { status, data, error } = useQuery({
    queryKey: ["synonymSuggestion", searchQueryParams],
    queryFn: () => getSynonymsSuggestions(searchQueryParams),
  });
  // set suggestions state and reset selector
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["synonymSuggestion"] });
    data && setSuggestions(data?.suggestions);
    setSelectedSuggestion(-1);
  }, [searchQueryParams.search, data]);

  const [subDropDownStates, setSubDropDownStates] = useState(
    new Array(conditions.length).fill(false)
  );
  const [synonymsDropDown, setSynonymsDropDown] = useState(
    new Array(conditions.length).fill(false)
  );
  const [synonymsDropDown2, setSynonymsDropDown2] = useState(
    new Array(conditions.length).fill(false)
  );
  const [selectedCondition, setSelectedCondition] = useState<string | null>(
    null
  );
  const [selectedDropDown, setSelectedDropDown] = useState<string | null>(null);
  const [selectedDropDown2, setSelectedDropDown2] = useState<string | null>(
    null
  );
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [popupPositionDropDown, setPopupPositionDropDown] = useState({
    x: 0,
    y: 0,
  });
  const [popupPositionDropDown2, setPopupPositionDropDown2] = useState({
    x: 0,
    y: 0,
  });

  // widget1 dropdown
  const handleDropDownClick = (
    index: any,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    const newSubDropDownStates = synonymsDropDown.map((state, i) =>
      i === index ? !state : false
    );
    setSynonymsDropDown(newSubDropDownStates);

    // Close the previously opened index div
    const previouslyOpenedIndex = synonymsDropDown.findIndex((state) => state);
    if (previouslyOpenedIndex !== -1 && previouslyOpenedIndex !== index) {
      newSubDropDownStates[previouslyOpenedIndex] = false;
      // Optionally, you can also set the selected condition to null here if needed:
      // setSelectedCondition(null);
    }

    // Toggle the selected condition based on the index
    setSelectedDropDown2(
      newSubDropDownStates[index] ? conditions[index] : null
    );

    const xPosition = event.clientX;
    const yPosition = event.clientY;
    setPopupPositionDropDown({ x: xPosition, y: yPosition });
  };
  const handleDropDownClick2 = (
    index: any,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    const newSubDropDownStates = synonymsDropDown2.map((state, i) =>
      i === index ? !state : false
    );
    setSynonymsDropDown2(newSubDropDownStates);

    // Close the previously opened index div
    const previouslyOpenedIndex = synonymsDropDown2.findIndex((state) => state);
    if (previouslyOpenedIndex !== -1 && previouslyOpenedIndex !== index) {
      newSubDropDownStates[previouslyOpenedIndex] = false;
      // Optionally, you can also set the selected condition to null here if needed:
      // setSelectedCondition(null);
    }

    // Toggle the selected condition based on the index
    setSelectedDropDown(newSubDropDownStates[index] ? conditions[index] : null);

    const xPosition = event.clientX;
    const yPosition = event.clientY;
    setPopupPositionDropDown2({ x: xPosition, y: yPosition });
  };

  const handleCloseSelectedCondition = () => {
    setSelectedCondition(null);
    setSubDropDownStates(new Array(conditions.length).fill(false));
  };
  const handleDropDownSelected = () => {
    // setSelectedCondition(null);
    setSelectedDropDown(null);
    setSynonymsDropDown(new Array(widgets1.length).fill(false));
  };

  const handleDropDownArrow = () => {
    setDropDownArrow(!dropDownArrow);
  };

  const handleSubDropDown = (
    index: number,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    const newSubDropDownStates = subDropDownStates.map((state, i) =>
      i === index ? !state : false
    );
    setSubDropDownStates(newSubDropDownStates);

    // Close the previously opened index div
    const previouslyOpenedIndex = subDropDownStates.findIndex((state) => state);
    if (previouslyOpenedIndex !== -1 && previouslyOpenedIndex !== index) {
      newSubDropDownStates[previouslyOpenedIndex] = false;
      // Optionally, you can also set the selected condition to null here if needed:
      // setSelectedCondition(null);
    }

    // Toggle the selected condition based on the index
    setSelectedCondition(
      newSubDropDownStates[index] ? conditions[index] : null
    );

    const xPosition = event.clientX;
    const yPosition = event.clientY;
    setPopupPosition({ x: xPosition, y: yPosition });
  };

  const [widgets1, setWidgets1] = useState<string[]>([]);
  const [widgets2, setWidgets2] = useState<string[]>([]);
  function handleOnDrag(e: React.DragEvent, widgetType: string) {
    e.dataTransfer.setData("widgetType", widgetType);
  }
  function handleOnDrop1(e: React.DragEvent) {
    const widgetType = e.dataTransfer.getData("widgetType") as string;
    setWidgets1([...widgets1, widgetType]);
  }

  function handleOnDrop2(e: React.DragEvent) {
    const widgetType = e.dataTransfer.getData("widgetType") as string;
    setWidgets2([...widgets2, widgetType]);
  }
  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  return (
    <div className="flex space-x-10 justify-center w-full mb-6">
      <div className="space-y-5">
        <div>
          <p className="text-lg mb-2">Condition</p>
          <div className="relative">
            <input
              placeholder="Condition"
              value={searchCondition}
              type="text"
              className="p-3 w-96 rounded-tl-md rounded-bl-md border border-gray-100 bg-white"
              onChange={(e) => setSearchCondition(e.target.value)}
            />
            <button className="p-3 border border-gray-100 rounded-tr-md rounded-br-md">
              Search
            </button>
            {status == "pending" ? (
              <span className="absolute w-96 top-full left-0 mt-2 p-3 border border-gray-100 rounded-md bg-white z-50">
                Loading...
              </span>
            ) : (
              searchCondition != "" && (
                <div className="absolute w-96 top-full left-0 mt-2 p-3 border border-gray-100 rounded-md bg-white z-50">
                  <ul className="flex flex-col gap-2">
                    {suggestions?.length > 0 &&
                      suggestions.map((e, i) => {
                        return (
                          <li
                            onClick={() => {
                              setBlockSearchCondition(suggestions[i]);
                              setSearchCondition(suggestions[i]);
                              setGetBlock(true);
                              setSearchCondition("");
                            }}
                            onMouseOver={() => setSelectedSuggestion(i)}
                            className={`py-1 hover:bg-gray-100 hover:cursor-pointer ${
                              selectedSuggestion == i ? "bg-gray-100" : ""
                            }`}
                            key={i}
                          >
                            <span>{e}</span>
                          </li>
                        );
                      })}
                  </ul>
                </div>
              )
            )}
          </div>
        </div>

        {/* dropdown */}
        <div className="relative">
          {condition ? (
            <div className="h-[300px] border-2 border-gray-100 rounded-md overflow-y-auto overflow-x-clip">
              <div className="flex justify-between m-4">
                <div className="flex space-x-2">
                  <p className="text-md font-semibold">
                    {blockSearchCondition}
                  </p>
                  <p className="bg-gray-300 text-sm text-center p-0.5 w-28 rounded-full">
                    {conditions.length} categories
                  </p>
                </div>
                <div>
                  <button
                    onClick={handleDropDownArrow}
                    className={`transform transition-transform duration-300 ${
                      dropDownArrow ? "rotate-180" : ""
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-arrow-down"
                      viewBox="0 0 16 16"
                    >
                      {" "}
                      <path
                        fill-rule="evenodd"
                        d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"
                      />{" "}
                    </svg>
                  </button>
                </div>
              </div>
              {dropDownArrow && (
                <div className="">
                  <p className="m-4 text-sm text-blue-600">Include all</p>
                  {conditions.map((condition, index) => (
                    <div className="relative" key={index}>
                      <div
                        draggable
                        onDragStart={(e) => handleOnDrag(e, condition)}
                        key={index}
                        className=" flex items-center justify-between border border-gray-100 m-4 p-2 rounded-md cursor-move"
                      >
                        {condition}
                        {/* This are the xy categories */}
                        <button
                          onClick={(event) => {
                            handleSubDropDown(index, event);
                            setSelectedCondition(condition); // recalled here because in handleSubDropDown is not working
                          }}
                          className={`transform transition-transform duration-300 ${
                            subDropDownStates[index] ? "rotate-180" : ""
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-arrow-down"
                            viewBox="0 0 16 16"
                          >
                            {" "}
                            <path
                              fill-rule="evenodd"
                              d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"
                            />{" "}
                          </svg>
                        </button>
                      </div>
                      {selectedCondition && selectedCondition == condition && (
                        <div
                          style={{
                            left: popupPosition.x,
                            top: popupPosition.y,
                          }}
                          className="fixed w-72 h-72 mt-2 p-4 bg-white border-gray-100 rounded-md shadow-lg overflow-y-scroll z-20"
                        >
                          {selectedCondition && (
                            <div>
                              <div className="flex justify-between items-center">
                                <p className="w-28 text-center text-sm text-white p-1 rounded-full bg-blue-400">
                                  {`${conditionBlock?.[selectedCondition]?.length} synonyms`}
                                </p>
                                <div
                                  className="cursor-pointer"
                                  onClick={handleCloseSelectedCondition}
                                >
                                  X
                                </div>
                              </div>
                              <div className="mt-4">
                                {/*conditions.flatMap((condition, index) => [
                                  <div
                                    key={`border-${index}`}
                                    className="border border-gray-100"
                                  />,
                                  <p
                                    key={`text-${index}`}
                                    className="text-sm my-1"
                                  >
                                    {condition}
                                  </p>,
                                ])*/}
                                {conditionBlock?.[selectedCondition]?.map(
                                  (synonym, i) => {
                                    return (
                                      <div
                                        key={`border-${i}`}
                                        className="border border-gray-100"
                                      >
                                        <p
                                          key={`text-${i}`}
                                          className="text-sm my-1"
                                        >
                                          {synonym}
                                        </p>
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="z-10 h-full border-2 border-gray-100 rounded-md">
              <p className="bg-gray-200 m-4 p-0.5 w-32 text-md text-center rounded-full">
                0 categories
              </p>
            </div>
          )}
        </div>
        {/* dropdown */}
        <div className="flex justify-end">
          <button className="bg-slate-500 p-2 w-52 rounded-md text-white">
            Add New Condition
          </button>
        </div>
      </div>

      <div className="bg-gray-100 w-[450px] mt-8 rounded-md p-4">
        <p className="mb-1 font-semibold text-sm">Synonyms to search</p>
        <div
          onDrop={handleOnDrop1}
          onDragOver={handleDragOver}
          className="w-full h-32 bg-white mb-2 rounded-md overflow-y-auto"
        >
          {widgets1.map((widget, index) => (
            <p
              key={`widget1-${index}`}
              className="flex items-center justify-between border border-gray-100 p-1 m-2 rounded-md"
            >
              {widget}
              <button onClick={(event) => handleDropDownClick(index, event)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className={`transform transition-transform duration-300 ${
                    synonymsDropDown[index] ? "rotate-180" : ""
                  } bi bi-arrow-down" viewBox="0 0 16 16`}
                >
                  {" "}
                  <path
                    fill-rule="evenodd"
                    d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"
                  />{" "}
                </svg>
              </button>
              {selectedDropDown && (
                <div
                  style={{
                    left: popupPositionDropDown2.x,
                    top: popupPositionDropDown2.y,
                  }}
                  className="fixed w-72 h-72 mt-2 p-4 bg-white border-gray-100 rounded-md shadow-lg"
                >
                  {selectedDropDown && (
                    <div>
                      <div className="flex justify-between items-center">
                        <p className="w-28 text-center text-sm text-white p-1 rounded-full bg-blue-400">
                          {conditions.length} synonyms
                        </p>
                        <div
                          className="cursor-pointer"
                          onClick={handleDropDownSelected}
                        >
                          X
                        </div>
                      </div>
                      <div className="mt-4">
                        {conditions.flatMap((condition, index) => [
                          <div
                            key={`border-${index}`}
                            className="border border-gray-100"
                          />,
                          <p key={`text-${index}`} className="text-sm my-1">
                            {condition}
                          </p>,
                        ])}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </p>
          ))}
        </div>
        <div className="flex justify-end items-center space-x-2">
          <p className="text-sm font-semibold">Additional synonyms</p>
          <input
            type="text"
            name=""
            id=""
            className="w-44 border border-gray-100 rounded-md placeholder:text-sm bg-white"
            placeholder="Synonyms"
          />
          <button className="border border-gray-100 bg-white p-1 rounded-md">
            + Add
          </button>
        </div>
        <br />
        <p className="mb-1 font-semibold text-sm">Synonyms to exclude</p>
        <div
          onDrop={handleOnDrop2}
          onDragOver={handleDragOver}
          className="w-full h-32 bg-white mb-2 rounded-md overflow-y-auto"
        >
          {widgets2.map((widget, index) => (
            <p
              key={`widget2-${index}`}
              className="flex items-center justify-between border border-gray-100 p-1 m-2 rounded-md"
            >
              {widget}
              <button onClick={(event) => handleDropDownClick2(index, event)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className={`transform transition-transform duration-300 ${
                    synonymsDropDown2[index] ? "rotate-180" : ""
                  } bi bi-arrow-down" viewBox="0 0 16 16`}
                >
                  {" "}
                  <path
                    fill-rule="evenodd"
                    d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"
                  />{" "}
                </svg>
              </button>
              {selectedDropDown2 && (
                <div
                  style={{
                    left: popupPositionDropDown.x,
                    top: popupPositionDropDown.y,
                  }}
                  className="fixed w-72 h-72 mt-2 p-4 bg-white border-gray-100 rounded-md shadow-lg"
                >
                  {selectedDropDown2 && (
                    <div>
                      <div className="flex justify-between items-center">
                        <p className="w-28 text-center text-sm text-white p-1 rounded-full bg-blue-400">
                          {conditions.length} synonyms
                        </p>
                        <div
                          className="cursor-pointer"
                          onClick={handleDropDownSelected}
                        >
                          X
                        </div>
                      </div>
                      <div className="mt-4">
                        {conditions.flatMap((condition, index) => [
                          <div
                            key={`border-${index}`}
                            className="border border-gray-100"
                          />,
                          <p key={`text-${index}`} className="text-sm my-1">
                            {condition}
                          </p>,
                        ])}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </p>
          ))}
        </div>
        <div className="flex justify-end items-center space-x-2">
          <p className="text-sm font-semibold">Additional synonyms</p>
          <input
            type="text"
            name=""
            id=""
            className="w-44 border border-gray-100 rounded-md placeholder:text-sm bg-white"
            placeholder="Synonyms"
          />
          <button className="border border-gray-100 bg-white p-1 rounded-md">
            + Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecondStep;
