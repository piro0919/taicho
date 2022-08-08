import { Root, Item, Indicator } from "@radix-ui/react-radio-group";
import Button from "components/Button";
import Image from "next/image";
import { MouseEventHandler } from "react";
import usePortal from "react-cool-portal";
import { SubmitHandler, useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import styles from "./style.module.scss";

type FieldValues = {
  condition: "good" | "average" | "poor" | "";
  feeling: "excellent" | "veryGood" | "good" | "average" | "poor" | "";
};

export type NewPortalProps = {
  defaultValues: FieldValues;
  onClose: MouseEventHandler<HTMLButtonElement>;
  onSubmit: SubmitHandler<FieldValues>;
};

function NewPortal({
  defaultValues,
  onClose,
  onSubmit,
}: NewPortalProps): JSX.Element {
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
    defaultValues,
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
                    <label className={styles.label} key={value}>
                      <Item value={value}>
                        <Indicator
                          {...register("feeling", { required: true })}
                        />
                        <div className={styles.imageWrapper}>
                          <Image
                            alt={value}
                            layout="fill"
                            objectFit="contain"
                            priority={true}
                            src={`/${value}.png`}
                            style={{
                              opacity: watch("feeling") === value ? 1 : 0.5,
                            }}
                          />
                        </div>
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
                      <div className={styles.imageWrapper}>
                        <Image
                          alt={value}
                          layout="fill"
                          objectFit="contain"
                          priority={true}
                          src={`/${value}.png`}
                          style={{
                            opacity: watch("condition") === value ? 1 : 0.5,
                          }}
                        />
                      </div>
                    </Item>
                  </label>
                ))}
              </Root>
            </fieldset>
          </div>
          <div className={styles.buttonWrapper}>
            <Button disabled={!isValid || isSubmitting} type="submit">
              保存する
            </Button>
          </div>
        </form>
        <div className={styles.buttonWrapper2}>
          <button className={styles.button} onClick={onClose}>
            <IoClose color="#00a387" size={36} />
          </button>
        </div>
      </div>
    </Portal>
  );
}

export default NewPortal;
