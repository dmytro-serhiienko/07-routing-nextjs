"use client";
import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from "formik";
import css from "./NoteForm.module.css";
import { useId } from "react";
import type { NewNote } from "../../types/note";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createNote } from "../../lib/api";
interface NoteFormProps {
  onCancel: () => void;
  isSubmitting?: boolean;
}
const NoteSchema = Yup.object().shape({
  title: Yup.string().min(3, "Too Short!").max(50, "Too Long!").required("Title is required"),
  content: Yup.string().max(500, "Too Long!").notRequired(),
  tag: Yup.string().oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"]).required(),
});
export default function NoteForm({ onCancel, isSubmitting = false }: NoteFormProps) {
  const fieldId = useId();
  const initialFormValues: NewNote = {
    title: "",
    content: "",
    tag: "Todo",
  };
  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: async () => {
      toast.success("Note created");
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      onCancel();
    },
    onError: () => {
      toast.error("Failed to create note");
    },
  });
  const handleSubmit = async (values: NewNote, actions: FormikHelpers<NewNote>) => {
    await createMutation.mutateAsync(values);
    actions.resetForm();
    actions.setSubmitting(false);
  };
  return (
    <Formik initialValues={initialFormValues} onSubmit={handleSubmit} validationSchema={NoteSchema}>
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-title`}>Title</label>
          <Field id={`${fieldId}-title`} type="text" name="title" className={css.input} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-content`}>Content</label>
          <Field as="textarea" id={`${fieldId}-content`} name="content" rows={8} className={css.textarea} />
          <ErrorMessage name="content" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-tag`}>Tag</label>
          <Field as="select" id={`${fieldId}-tag`} name="tag" className={css.select}>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage name="tag" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button
            type="button"
            className={css.cancelButton}
            onClick={onCancel}
            disabled={isSubmitting || createMutation.isPending}
          >
            Cancel
          </button>
          <button type="submit" className={css.submitButton} disabled={isSubmitting || createMutation.isPending}>
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
}
