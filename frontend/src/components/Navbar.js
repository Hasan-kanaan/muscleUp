import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

const Navbar = () => {
  const navbarRef = useRef(null);
  const linkRef = useRef(null);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos]);

  useEffect(() => {
    gsap.to(linkRef.current, {
      backgroundPosition: "200% 0%",
      duration: 3, // Slowed down the animation
      repeat: -1,
      ease: "linear",
    });
  }, []);

  const { logout } = useLogout();
  const { user } = useAuthContext();

  const handleLogout = () => {
    logout();
  };

  return (
    <header
      ref={navbarRef}
      className={`navbar ${visible ? "active" : "hidden"}`}
    >
      <div className="container">
        <Link to="/">
          <h1 className="navbar-text" ref={linkRef}>
            Workout Buddy
          </h1>
        </Link>
        <nav>
          {user && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{padding: "10px"}}>{user.email}</span>
              <button className="button-reverse" onClick={handleLogout}>Log out</button>
            </div>
          )}
          {!user && (
            <div>
              <Link className="button-reverse" to="/login">
                Login
              </Link>
              <Link className="button-reverse" to="/signup">
                Sign up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
