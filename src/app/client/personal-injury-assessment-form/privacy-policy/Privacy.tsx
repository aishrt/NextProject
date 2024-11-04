import { Button } from "@/components/Form/Button";
import ContentWrapper from "@/components/Layout/Client/ContentWrapper";
import axios from "axios";
import Link from "next/link";

export default function Privacy({ handleNext }: any) {
  return (
    <ContentWrapper>
      <div className="lease-privacy white-card">
        <h2 className="f-22 bold mb-2">Personal Injury Assessment Form</h2>
        <h2 className="f-22 bold mt-4">WELCOME !</h2>

        <p className="f-14 gray mt-3">
          Your privacy is important to us. Please see our{" "}
          <Link href="/" className="bold">
            {" "}
            Privacy Policy.
          </Link>{" "}
          for more information on how we handle your data.
        </p>

        <p>
          <strong>Need help? </strong> Click the &quot;Help&quot; button to ask
          a question or request a callback from our team. We&apos;re here to
          assist you!
        </p>

        <p>
          <strong>Your progress is saved automatically. </strong> You can come
          back and finish this later.
        </p>

        <h2 className="f-22 bold mt-4">Hi there!</h2>
        <p className="f-14 gray pb-4">
          We understand that experiencing an injury can be stressful. This form
          helps us gather the information needed to assess your personal injury
          claim. It should take about 15 minutes to complete, depending on the
          complexity of your case.
        </p>

        <h2 className="f-18 mb-2">Form Completion Tips: </h2>
        <p className="f-14 gray mb-1">
          📄 Have your medical and accident documents handy. Accurate
          information is essential for this evaluation.
        </p>
        <p className="f-14 gray mb-1">
          💾 Unsure about a question? You can save your progress and come back
          to it later.
        </p>
        {/* <p className="f-14 gray mt-2 ">
          Your information is confidential and will only be used to evaluate
          your claim. For details, please see our{" "}
          <Link href="/" className="bold">
            {" "}
            Privacy Policy.
          </Link>
        </p> */}
      </div>
      <div className="agree-btn mt-4 text-center">
        <Button
          type="submit"
          variant="contained"
          className="green-btn"
          size="lg"
          onClick={handleNext}
        >
          Continue
        </Button>
      </div>
    </ContentWrapper>
  );
}
