import { useRef, useState } from "react";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import upload from "../assets/images/upload-svgrepo-com.svg";
import checked from "../assets/images/checked-svgrepo-com.svg";
import { useAuthContext } from "../hooks/useAuthContext";

const WorkoutForm = () => {
  const { user } = useAuthContext();
  const { dispatch } = useWorkoutsContext();
  const imgInputRef = useRef(null);

  const [workout, setWorkout] = useState({
    title: "",
    description: "",
    reps: "",
    sets: "",
    image: null,
  });
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!user){
      return new Error("You must be logged in");
    }

    const formData = new FormData();

    formData.append("title", workout.title);
    formData.append("description", workout.description);
    formData.append("reps", workout.reps);
    formData.append("sets", workout.sets);
    if (workout.image) {
      formData.append("image", workout.image);
    }

    const response = await fetch(process.env.REACT_APP_API + "/api/workouts", {
      method: "POST",
      body: formData,
      headers: {
        "Authorization": `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields);
    }
    if (response.ok) {
      setWorkout({
        title: "",
        descripotion: "",
        reps: "",
        sets: "",
        image: null,
      });
      setError(null);
      setEmptyFields([]);
      console.log("new workout added", json);
      dispatch({ type: "CREATE_WORKOUT", payload: json });
    }
  };

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

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add a New Workout</h3>

      <label>Excersize Title:</label>
      <input
        required
        type="text"
        onChange={(e) => setWorkout({ ...workout, title: e.target.value })}
        value={workout.title}
        className={emptyFields.includes("title") ? "error" : ""}
      />

      <label>Description:</label>
      <textarea
        type="text"
        onChange={(e) =>
          setWorkout({ ...workout, description: e.target.value })
        }
        value={workout.description}
        className={emptyFields.includes("desscription") ? "error" : ""}
      />

      <label>Sets:</label>
      <input
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
        className={emptyFields.includes("sets") ? "error" : ""}
      />

      <label>Reps:</label>
      <input
        required
        type="number"
        min={1}
        step={1}
        onMouseEnter={handleFocus}
        onMouseLeave={handleBlur}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={(e) => {
          const sanitizedValue = e.target.value.replace(/[^0-9]/g, "");
          setWorkout({ ...workout, reps: sanitizedValue });
        }}
        value={workout.reps}
        className={emptyFields.includes("reps") ? "error" : ""}
      />

      <div
        className="workout-img"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          cursor: "pointer",
        }}
        onClick={() => imgInputRef.current.click()}
      >
        <label className="workout-img-label" style={{ cursor: "pointer" }}>
          Upload an image:{" "}
        </label>
        <input
          type="file"
          style={{ display: "none" }}
          ref={imgInputRef}
          onChange={(e) => setWorkout({ ...workout, image: e.target.files[0] })}
        />
        <img
          className="workout-img-upload"
          src={workout?.image ? checked : upload}
          alt="upload"
          style={{ width: "25px", height: "25px" }}
          onClick={(e) => {
            e.stopPropagation();
            imgInputRef.current.click();
          }}
        />
      </div>
      <button>Add Workout</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default WorkoutForm;
