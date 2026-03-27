"use client";
import SearchBox from "@/components/SearchBox/SearchBox";
import css from "./NotesPage.module.css";
import { fetchNotes } from "@/lib/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import NoteForm from "@/components/NoteForm/NoteForm";
import Modal from "@/components/Modal/Modal";

export default function NotesClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["notes", { query, page }],
    queryFn: () => fetchNotes(query, page),
    initialData: {
      notes: [],
      totalPages: 0,
    },
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    retry: false,
  });
  const debouncedQuery = useDebouncedCallback((value: string) => {
    setQuery(value);
    setPage(1);
  }, 500);
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedQuery(value);
  };
  useEffect(() => {
    if (query.trim() === "") return;
    if (isFetching) return;
    if (data.notes.length === 0) {
      return;
    }
  }, [isFetching, query, data.notes.length]);
  const handleModalOpen = () => {
    setModalIsOpen(true);
  };
  const handleModalClose = () => {
    setModalIsOpen(false);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchTerm} onChange={handleSearch} />

        {data?.totalPages && data?.totalPages > 1 && (
          <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
        )}

        <button className={css.button} onClick={handleModalOpen}>
          Create note +
        </button>
      </header>

      {data?.notes?.length > 0 && !isLoading && !isError && <NoteList notes={data.notes} />}

      {modalIsOpen && <Modal onClose={handleModalClose}>{<NoteForm onCancel={handleModalClose}></NoteForm>}</Modal>}
    </div>
  );
}
