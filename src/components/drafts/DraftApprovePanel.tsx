import React, { useState } from 'react';
import { useMerchiFormContext } from '../../context/MerchiProductFormProvider';
import { DraftTemplateData, RenderedDraftPreview, MerchiFile } from '../../utils/types';

function DraftPreview({ templateData }: { templateData: RenderedDraftPreview }) {
  const {
    canvasPreview,
  } = templateData;
  return (
    <div>
      <img src={canvasPreview} alt="Draft Preview" />
    </div>
  );
}

async function uploadBase64Image(
  apiUrl: string,
  groupId: number,
  templateId: number,
  base64: string,
  suffix: string = 'preview'
): Promise<MerchiFile> {
  // Remove "data:image/..." prefix if present
  const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;

  // Convert base64 to binary data
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);

  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  // Create a Blob from the binary data
  const blob = new Blob([bytes], { type: 'image/png' });

  // Create a File from the Blob
  const file = new File(
    [blob],
    `group-${groupId}-template-${templateId}-draft-${suffix}-${Date.now()}.png`,
    { type: 'image/png' }
  );

  const formData = new FormData();
  formData.append('0', file);

  const response = await fetch(`${apiUrl}public-upload-job-files/`, {
    method: 'POST',
    body: formData
  });

  let data;
  if (!response.ok) {
    throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
  } else {
    data = await response.json();
    return data.file;
  }
}

interface DraftApprovePanelProps {
  customFooterContent?: React.ReactNode;
}

export default function DraftApprovePanel({
  customFooterContent,
}: DraftApprovePanelProps) {
  const {
    apiUrl,
    classNameButtonApproveDrafts,
    classNameButtonCloseDrafts,
    classNameDraftButtonContainer,
    classNameDraftGroupContainer,
    classNameDraftGroupTitle,
    draftApproveCallback,
    job,
    product,
    setIsDraftModalOpen,
    setJob,
    showAlert,
  } = useMerchiFormContext();
  const [isLoading, setIsLoading] = useState(false);
  const data = localStorage.getItem(`productDraftTemplate-${product.id}`);
  if (!data) {
    return null;
  }
  const draftData: DraftTemplateData[] = JSON.parse(data);

  const doUpload = async (
    groupIndex: number,
    templateId: number,
    base64: string,
    suffix: string,
  ) => uploadBase64Image(
    (apiUrl as string),
    groupIndex,
    templateId,
    base64,
    suffix,
  );

  async function approveDrats() {
    console.log(
      "[DraftApprovePanel] approveDrats fired, draftApproveCallback =",
      draftApproveCallback
    );

    if (!draftApproveCallback) {
      showAlert({ message: "No draftApproveCallback, aborting." });
      return;
    }

    setIsLoading(true);
    try {
      const draftFiles: MerchiFile[] = [];
      const clientFiles: MerchiFile[] = [];
      for (const group of draftData) {
        for (const template of group.templateData) {
          const clientFile = await doUpload(group.groupIndex, template.templateId, template.draft, "client");
          const draftFile = await doUpload(group.groupIndex, template.templateId, template.canvasPreview, "draft");
          clientFiles.push(clientFile);
          draftFiles.push(draftFile);
        }
      }

      const jobData = {
        ...job,
        clientFiles: clientFiles.map(f => ({ id: f.id })),
        ownDrafts: [{ images: draftFiles.map(f => ({ id: f.id })) }]
      };
      setJob(jobData);

      console.log("[DraftApprovePanel] about to call callback with jobData:", jobData);
      await draftApproveCallback(jobData);
      console.log("[DraftApprovePanel] callback finished!");

      setIsDraftModalOpen(false);

    } catch (e: any) {
      const message = e.errorMessage || e.message || "Upload error";
      showAlert({ message });
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div>
      {draftData.map((draft, index) => (
        <div key={index} className={classNameDraftGroupContainer}>
          <h3 className={classNameDraftGroupTitle}>Group {index + 1}</h3>
          {draft.templateData.map((tD: RenderedDraftPreview, tDIndex: number) => (
            <DraftPreview key={tDIndex} templateData={tD} />
          ))}
        </div>
      ))}
      {customFooterContent}
      <div className={classNameDraftButtonContainer}>
        <button
          type="button"
          className={classNameButtonCloseDrafts}
          onClick={() => {
            setIsDraftModalOpen(false);
          }}
          disabled={isLoading}
        >
          Close Drafts
        </button>
        <button
          type="button"
          className={classNameButtonApproveDrafts}
          disabled={isLoading}
          onClick={approveDrats}
        >
          Approve Drafts
        </button>
      </div>
    </div>
  );
}
