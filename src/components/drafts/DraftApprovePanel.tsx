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
}

export default function DraftApprovePanel({

}: DraftApprovePanelProps) {
  const {
    apiUrl,
    classNameButtonApproveDrafts,
    classNameButtonCloseDrafts,
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
    setIsLoading(true);
    const draftFiles: MerchiFile[] = [];
    const clientFiles: MerchiFile[] = [];
    try {
      for (const group of draftData) {
        const {
          groupIndex,
          templateData,
        } = group;
        for (const template of templateData) {
          const {
            canvasPreview,
            draft,
            templateId,
          } = template;
          const clientFile = await doUpload(
            groupIndex,
            templateId,
            'client',
            draft,
          );
          const draftFile = await doUpload(
            groupIndex,
            templateId,
            'draft',
            canvasPreview,
          );
          draftFiles.push(draftFile);
          clientFiles.push(clientFile);
        }
      }
      const jobData = {...job};
      jobData.clientFiles = clientFiles.map((file: MerchiFile) => ({id: file.id}));
      jobData.ownDrafts = [{images: draftFiles.map((file: MerchiFile) => ({id: file.id}))}];
      setJob(jobData);
      setIsDraftModalOpen(false);
    } catch (error) {
      const message = error.errorMessage || error.message || 'Server error';
      showAlert({ message });
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div>
      {draftData.map((draft, index) => (
        <div key={index}>
          <h3>Group {index + 1}</h3>
          {draft.templateData.map((tD: RenderedDraftPreview, tDIndex: number) => (
            <DraftPreview key={tDIndex} templateData={tD} />
          ))}
        </div>
      ))}
      <button
        className={classNameButtonCloseDrafts}
        onClick={() => {
          setIsDraftModalOpen(false);
        }}
        disabled={isLoading}
      >
        Close Drafts
      </button>
      <button
        className={classNameButtonApproveDrafts}
        disabled={isLoading}
        onClick={approveDrats}
      >
        Approve Drafts
      </button>
    </div>
  );
}
