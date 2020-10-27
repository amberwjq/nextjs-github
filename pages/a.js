import { withRouter } from "next/router";
import dynamic from "next/dynamic";

const A = ({ router, name, time }) => (
  <span>
    A{router.query.id} {name} {time}
  </span>
);

A.getInitialProps = async () => {
  const moment = await import("moment");

  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        name: "amber",
        time: moment.default(Date.now() - 60 * 1000).fromNow(),
      });
    }, 1000);
  });
  return await promise;
}; // the object returned from 'getInitialProps' will the props that can be passed into A component
export default withRouter(A);
