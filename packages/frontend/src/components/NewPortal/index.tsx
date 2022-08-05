import { Root, Item, Indicator } from "@radix-ui/react-radio-group";
import Image from "next/image";
import usePortal from "react-cool-portal";
import { SubmitHandler, useForm } from "react-hook-form";
import styles from "./style.module.scss";

type FieldValues = {
  condition: "good" | "average" | "poor" | "";
  feeling: "excellent" | "veryGood" | "good" | "average" | "poor" | "";
};

export type NewPortalProps = {
  onSubmit: SubmitHandler<FieldValues>;
};

function NewPortal({ onSubmit }: NewPortalProps): JSX.Element {
  const { Portal } = usePortal({
    defaultShow: true,
  });
  const {
    formState: { isSubmitting, isValid },
    handleSubmit,
    register,
    setValue,
    watch,
  } = useForm<FieldValues>({
    defaultValues: {
      condition: "",
      feeling: "",
    },
  });

  return (
    <Portal>
      <div className={styles.inner}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.fieldsetsWrapper}>
            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>今日の気分</legend>
              <Root
                className={styles.root}
                name="feeling"
                onValueChange={(value): void => {
                  if (
                    value !== "excellent" &&
                    value !== "veryGood" &&
                    value !== "good" &&
                    value !== "average" &&
                    value !== "poor"
                  ) {
                    return;
                  }

                  setValue("feeling", value);
                }}
              >
                {["excellent", "veryGood", "good", "average", "poor"].map(
                  (value) => (
                    <label key={value}>
                      <Item value={value}>
                        <Indicator
                          {...register("feeling", { required: true })}
                        />
                        <Image
                          alt={value}
                          height={64}
                          objectFit="contain"
                          priority={true}
                          src={`/${value}.png`}
                          style={{
                            opacity: watch("feeling") === value ? 1 : 0.5,
                          }}
                          width={64}
                        />
                      </Item>
                    </label>
                  )
                )}
              </Root>
            </fieldset>
            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>今日の体調</legend>
              <Root
                className={styles.root}
                name="condition"
                onValueChange={(value): void => {
                  if (
                    value !== "good" &&
                    value !== "average" &&
                    value !== "poor"
                  ) {
                    return;
                  }

                  setValue("condition", value);
                }}
              >
                {["good", "average", "poor"].map((value) => (
                  <label key={value}>
                    <Item value={value}>
                      <Indicator
                        {...register("condition", { required: true })}
                      />
                      <Image
                        alt={value}
                        height={64}
                        objectFit="contain"
                        priority={true}
                        src={`/${value}.png`}
                        style={{
                          opacity: watch("condition") === value ? 1 : 0.5,
                        }}
                        width={64}
                      />
                    </Item>
                  </label>
                ))}
              </Root>
            </fieldset>
          </div>
          <div className={styles.buttonWrapper}>
            <button
              className={styles.button}
              disabled={!isValid || isSubmitting}
              type="submit"
            >
              保存する
            </button>
          </div>
        </form>
      </div>
    </Portal>
  );
}

export default NewPortal;
