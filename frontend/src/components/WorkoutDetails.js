import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import Tooltip from "./Tooltip/Tooltip";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

const WorkoutDetails = ({ workout }) => {
  const { user } = useAuthContext();
  const { dispatch } = useWorkoutsContext();
  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.stopPropagation();
    if (!user) {
      return new Error("You must be logged in");
    }

    const response = await fetch(
      process.env.REACT_APP_API + "/api/workouts/" + workout._id,
      {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${user.token}`,
        },
      }
    );
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "DELETE_WORKOUT", payload: workout._id });
    }
  };

  return (
    <div
      className="workout-details"
      style={{ cursor: "pointer" }}
      onClick={() => {
        navigate("/" + workout._id);
      }}
    >
      <div className="workout-details-field">
        <h4>
          <Tooltip title={workout.title}>{workout.title}</Tooltip>
        </h4>
        <p>
          <strong>Description: </strong>
          {workout.description ? workout.description : "No description added"}
        </p>
        <p>
          <strong>Sets: </strong>
          {workout.sets}
        </p>
        <p>
          <strong>Reps: </strong>
          {workout.reps}
        </p>
        <p style={{ textAlign: "end", marginTop: "auto" }}>
          {formatDistanceToNow(new Date(workout.createdAt), {
            addSuffix: true,
          })}
        </p>
      </div>
      <div
        className="workout-details-banner"
        style={{
          width: "50%",
          flexGrow: 0,
          background: workout.image ? "none" : "#1aac83",
        }}
      >
        {workout?.image && (
          <img
            src={process.env.REACT_APP_API + workout.image}
            alt=""
            style={{ width: "100%", height: "100%" }}
          />
        )}
      </div>
      <span
        className="material-symbols-outlined"
        onClick={handleClick}
        style={{ cursor: "pointer" }}
      >
        delete
      </span>
    </div>
  );
};

export default WorkoutDetails;
