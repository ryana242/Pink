import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faFax, faPhone } from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faInstagram,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

function Footer() {
  return (
    <footer class="footer primary-color pt-3">
      <div class="container">
        <div class="row">
          <div class="col-md-6">
            <img
              src={require("../Assets/footer-logo.png")}
              style={{
                width: "300px",
                marginTop: "0px",
                marginLeft: "-10px",
                maxHeight: "50px",
              }}
            ></img>
            <p class="text-white">
            Dhaka University Campus, Dhaka-1000, Bangladesh
              <br />
              <FontAwesomeIcon icon={faPhone} /> +88 09666 911 463
              &nbsp;&nbsp;|&nbsp;&nbsp; <FontAwesomeIcon icon={faFax} /> Website:
              https://www.du.ac.bd/body/CSE
              <br />
              <FontAwesomeIcon icon={faEnvelope} /> office@cse.du.ac.bd
            </p>
          </div>
          <div class="col-md-5 offset-lg-1">
            <div class="">
              <ul class="list-group list-group-horizontal mb-3">
                <li class="border border-2 rounded border-light me-2">
                  <a
                    href="https://www.facebook.com/Dept.CSE.DU"
                    class="btn btn-default text-white social-icon"
                    target="_blank"
                  >
                    <FontAwesomeIcon icon={faFacebook} />
                  </a>
                </li>
                <li class="border border-2 rounded border-light me-2">
                  <a
                    href="https://www.instagram.com/explore/locations/422219917/department-of-computer-science-engineering-university-of-dhaka-csedu/"
                    class="btn btn-default text-white social-icon"
                    target="_blank"
                  >
                    <FontAwesomeIcon icon={faInstagram} />
                  </a>
                </li>
                <li class="border border-2 rounded border-light">
                  <a
                    href="https://www.youtube.com/@DhakaUniversityDU"
                    class="btn btn-default text-white social-icon"
                    target="_blank"
                  >
                    <FontAwesomeIcon icon={faYoutube} />
                  </a>
                </li>
              </ul>
              <div class="clearfix"></div>
            </div>
            <div class="text-white">
              Developed & Maintained by IT Cell, DU
              <br /> &copy; 2023 University of Dhaka. All Rights Reserved.
              reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
