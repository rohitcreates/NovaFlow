"use client";

import { useState } from "react";

type TaskDescriptionProps = {
  description?: string;
};

export default function TaskDescription({
  description,
}: TaskDescriptionProps) {
  const [expanded, setExpanded] = useState(false);

  const hasDescription = Boolean(description?.trim());

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-xl font-semibold tracking-tight text-gray-950">
          Description
        </h2>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white px-6 py-5">
        {hasDescription ? (
          <>
            <p
              className={`whitespace-pre-wrap text-sm leading-7 text-gray-700 ${
                expanded ? "" : "line-clamp-4"
              }`}
            >
              {description}
            </p>

            {description!.length > 220 && (
              <button
                type="button"
                onClick={() => setExpanded((value) => !value)}
                className="mt-3 text-sm font-medium text-gray-950 transition hover:text-gray-500"
              >
                {expanded ? "Show less ↑" : "Read more →"}
              </button>
            )}
          </>
        ) : (
          <p className="text-sm text-gray-400">
            No description provided.
          </p>
        )}
      </div>
    </section>
  );
}