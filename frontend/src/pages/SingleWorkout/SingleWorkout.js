import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import "./SingleWorkout.scss";
import upload from "../../assets/images/upload-black.svg";

function SingleWorkout() {
  const { id } = useParams();
  const [workout, setWorkout] = useState({
    title: "",
    description: "",
    sets: "",
    reps: "",
    image: null,
  });

  useEffect(() => {
    const fectchSingleWorkout = async () => {
      const response = await fetch(
        process.env.REACT_APP_API + `/api/workouts/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const json = await response.json();
      if (response.ok) {
        setWorkout(json);
      }
    };
    fectchSingleWorkout();
  }, [id]);

  const [edit, setEdit] = useState(false);

  // Disable page scrolling
  const disableScroll = (e) => {
    if (e.target === e.currentTarget) {
      // Prevent scroll on the page if not inside the input
      e.preventDefault();
    }
  };

  // Enable page scrolling
  const enableScroll = () => {
    window.removeEventListener("wheel", disableScroll, { passive: false });
  };

  // Disable scroll on focus
  const handleFocus = () => {
    window.addEventListener("wheel", disableScroll, { passive: false });
  };

  // Enable scroll on blur (when input is no longer focused)
  const handleBlur = () => {
    enableScroll();
  };

  const uploadRef = useRef(null);

  const [uploadFile, setUploadFile] = useState(null);

  const [show, setShow] = useState(false);

  useEffect(() => {
    const uploadImage = async () => {
      if (uploadFile) {
        const formData = new FormData();
        formData.append("image", uploadFile);

        try {
          const response = await fetch(
            process.env.REACT_APP_API + `/api/workouts/${id}`,
            {
              method: "PATCH",
              body: formData,
            }
          );
          const json = await response.json();
          if (response.ok) {
            setWorkout({ ...workout, image: json.image });
          }
        } catch (error) {
          console.error("Error uploading image:", error);
        } finally {
          setUploadFile(null);
        }
      }
    };

    uploadImage();
  }, [uploadFile]);

    const editWorkout = async () => {
        const workoutData = {
          title: workout.title,
          description: workout.description,
          reps: workout.reps,
          sets: workout.sets,
        };
  
        try {
          const response = await fetch(process.env.REACT_APP_API + `/api/workouts/${id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(workoutData),
          });
          const json = await response.json();
          if (response.ok) {
            setWorkout({ ...workout, image: json.image });
            setEdit(false);
          }
        } catch (error) {
          console.error("Error editing workout:", error);
        }
    };

  return (
    <div className="singleWOrkout">
      <div
        className={`singleWorkout-banner ${show ? "blur" : ""}`}
        style={{ background: workout?.image ? "none" : "#1aac83" }}
        onClick={() => {
          uploadRef.current.click();
        }}
        onMouseEnter={() => {
          setShow(true);
        }}
        onMouseLeave={() => {
          setShow(false);
        }}
      >
        {(!workout?.image || show) && (
          <img
            src={upload}
            alt="upload"
            className="upload"
            style={{
              width: "50px",
              zIndex: 1,
              position: "absolute",
              cursor: "pointer",
              top: "50%",
              left: "50%",
            }}
          />
        )}

        <input
          type="file"
          ref={uploadRef}
          style={{ display: "none" }}
          onChange={(e) => {
            setUploadFile(e.target.files[0]);
          }}
        />
        {workout?.image && (
          <img
            className="singleWorkout-banner-image"
            src={process.env.REACT_APP_API + workout.image}
            alt=""
            style={{ width: "100%", height: "100%" }}
          />
        )}
      </div>
      <div className="singleWorout-data">
        <div className="SingleWorkout-filed-Top">
          <div className="SingleWorkout-filed">
            <label htmlFor="title"> Workout Title: </label>
            {edit ? (
              <input
                required
                id="title"
                name="title"
                type="text"
                value={workout?.title}
                onChange={(e) => {
                  setWorkout({ ...workout, title: e.target.value });
                }}
                disabled={!edit}
              />
            ) : (
              <div className="SingleWorkout-filed-title">
                {workout.title.charAt(0).toUpperCase() + workout.title.slice(1)}
              </div>
            )}
          </div>
          <div className="editButton">
            <button
              onClick={() => {
                if (edit) {
                  editWorkout();
                } else {
                  setEdit(true);
                }
              }}
            >
              {edit ? "Save" : "Edit"}
            </button>
          </div>
        </div>
        <div className="SingleWorkout-filed">
          <label htmlFor="description"> Description: </label>
          {edit ? (
            <textarea
              id="description"
              name="description"
              value={workout.description}
              onChange={(e) => {
                setWorkout({ ...workout, description: e.target.value });
              }}
            />
          ) : (
            <div className="SingleWorkout-filed-text">
              {workout.description
                ? workout.description
                : "No description added"}
            </div>
          )}
        </div>
        <div className="SingleWorkout-filed">
          <label htmlFor="sets"> Sets: </label>
          {edit ? (
            <input
              id="sets"
              name="sets"
              required
              type="number"
              min={1}
              step={1}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={(e) => {
                const sanitizedValue = e.target.value.replace(/[^0-9]/g, "");
                setWorkout({ ...workout, sets: sanitizedValue });
              }}
              value={workout.sets}
            />
          ) : (
            <div className="SingleWorkout-filed-text">{workout.sets}</div>
          )}
        </div>
        <div className="SingleWorkout-filed">
          <label htmlFor="reps"> Reps: </label>
          {edit ? (
            <input
              id="reps"
              name="reps"
              required
              type="number"
              min={1}
              step={1}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={(e) => {
                const sanitizedValue = e.target.value.replace(/[^0-9]/g, "");
                setWorkout({ ...workout, reps: sanitizedValue });
              }}
              value={workout.reps}
            />
          ) : (
            <div className="SingleWorkout-filed-text">{workout.reps}</div>
          )}
        </div>
      </div>
      <div className="updatedAt">
        Updated at: {new Date(workout.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
}

export default SingleWorkout;
