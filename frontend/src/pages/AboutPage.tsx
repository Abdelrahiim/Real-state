const AboutPage = () => {

  return (
    <div className={"py-20 px-4 max-w-6xl mx-auto"}>
      <h1 className={"text-3xl font-bold my-4 text-slate-800"}>
        About Infinity State
      </h1>
      <p className={"mb-5 text-slate-700"}>
        Infinity State is a full-service real estate company that is dedicated to providing our clients with the highest
        level of
        service and expertise. We have a team of experienced and knowledgeable agents who are passionate about helping
        our clients achieve their real estate goals.

      </p>
      <h3 className={"text-2xl font-semibold mb-2 mt-4"}>Our Mission </h3>
      <p className={"mb-5 text-slate-700"}>
        Our mission is to provide our clients with a seamless and stress-free real estate experience. We strive to
        understand our clients' needs and wants, and we work tirelessly to help them achieve their goals. We are
        committed to providing our clients with honest and ethical advice, and we always put their best interests first.
      </p>
      <h3 className={"text-2xl font-semibold mb-2 mt-4"}>Our Goals</h3>
      <ul className={"space-y-1 text-slate-700 list-disc list-inside"}>
        <li>To be the most trusted and respected real estate company in our market.</li>
        <li>To provide our clients with the highest level of service and expertise.</li>
        <li>To help our clients achieve their real estate goals.</li>
        <li>To build long-term relationships with our clients.</li>
      </ul>
      <h3 className={"text-2xl font-semibold mb-2 mt-4"}>Why Choose Us?</h3>
      <ul className={"space-y-1 text-slate-700 list-disc list-inside"}>
        <li>We have a team of experienced and knowledgeable agents who are passionate about helping our clients achieve
          their goals.
        </li>
        <li>We are committed to providing our clients with honest and ethical advice.</li>
        <li>We always put our clients' best interests first.</li>
        <li>We offer a wide range of real estate services, including buying and selling homes, commercial real estate,
          and investment properties.
        </li>
        <li>We have a strong track record of success.</li>
      </ul>
    </div>

  );
};
export default AboutPage
