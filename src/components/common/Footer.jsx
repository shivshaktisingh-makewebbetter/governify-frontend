const Footer = () => {
  return (
    <footer
      className="text-white-50 d-flex"
      style={{
        width: "100%",
        maxWidth: "1296px",
        justifyContent: "space-between",
        margin: "auto",
        marginTop: "100px",
        borderTop: "2px solid #ececec",
        padding: "20px",
        flexWrap: "wrap",
      }}
    >
      <div className="align-center text-secondary">
        <small
          style={{
            fontSize: "15px",
            fontWeight: "400",
            color: "#848484",
            fontFamily: "Graphie-Regular",
          }}
        >
          Powered by TASC Outsourcing®
        </small>
      </div>
      <div
        className="align-center text-secondary fs-6"
        style={{
          display: "flex",
          gap: "20px",
          justifyContent: "end",
          alignItems: "center",
        }}
      >
        <a
          target="blank"
          href="https://tascoutsourcing.sa/en/terms-of-use"
          style={{
            fontWeight: "400",
            fontSize: "15px",
            color: "#848484",
            fontFamily: "Graphie-Regular",
          }}
        >
          Terms of use
        </a>
        <a
          target="blank"
          href="https://tascoutsourcing.sa/en/privacy-policy"
          style={{
            fontWeight: "400",
            fontSize: "15px",
            color: "#848484",
            fontFamily: "Graphie-Regular",
          }}
        >
          Data Privacy
        </a>
        <a
          target="blank"
          href="https://tascoutsourcing.sa/en/disclaimer"
          style={{
            fontWeight: "400",
            fontSize: "15px",
            color: "#848484",
            fontFamily: "Graphie-Regular",
          }}
        >
          Policy Fraud
        </a>
        <a
          target="blank"
          href="https://tascoutsourcing.sa/en/fraud-scam-alert"
          style={{
            fontWeight: "400",
            fontSize: "15px",
            color: "#848484",
            fontFamily: "Graphie-Regular",
          }}
        >
          Scam Alert
        </a>
      </div>
    </footer>
  );
};

export default Footer;
