import morgan from "morgan";

// Custom morgan format
morgan.token("body", (req) => JSON.stringify(req.body));
morgan.token("id", (req) => req.id);
morgan.token("ip", (req) => req.ip);

const customMorgan =
  morgan(
    ":method :url :status :response-time ms - from :ip - body :body",
    {
      skip: (req, res) => process.env.NODE_ENV === "test",
    }
  );

export default customMorgan;
