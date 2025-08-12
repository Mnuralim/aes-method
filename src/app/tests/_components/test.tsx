"use client";
import React, { useState } from "react";
import { Trash2, Plus, Calculator, AlertCircle } from "lucide-react";
import { encryptAES } from "@/lib/aes";

function calculateAvalancheEffect(
  encrypted1: string,
  encrypted2: string
): number {
  const bytes1 = [];
  const bytes2 = [];

  try {
    const binary1 = atob(encrypted1);
    const binary2 = atob(encrypted2);

    for (let i = 0; i < binary1.length; i++) {
      bytes1.push(binary1.charCodeAt(i));
    }
    for (let i = 0; i < binary2.length; i++) {
      bytes2.push(binary2.charCodeAt(i));
    }
  } catch (e) {
    console.log(e);
    for (let i = 0; i < encrypted1.length; i++) {
      bytes1.push(encrypted1.charCodeAt(i));
    }
    for (let i = 0; i < encrypted2.length; i++) {
      bytes2.push(encrypted2.charCodeAt(i));
    }
  }

  let diffBits = 0;
  let totalBits = 0;
  const maxLength = Math.max(bytes1.length, bytes2.length);

  for (let i = 0; i < maxLength; i++) {
    const byte1 = bytes1[i] || 0;
    const byte2 = bytes2[i] || 0;

    const xor = byte1 ^ byte2;

    for (let bit = 0; bit < 8; bit++) {
      if ((xor >> bit) & 1) {
        diffBits++;
      }
      totalBits++;
    }
  }

  return totalBits > 0 ? (diffBits / totalBits) * 100 : 0;
}

interface TestData {
  id: number;
  original: string;
  modified: string;
}

interface TestResult extends TestData {
  avalancheEffect: number;
  originalEncrypted: string;
  modifiedEncrypted: string;
}

export const Test = () => {
  const [testDataList, setTestDataList] = useState<TestData[]>([]);
  const [currentOriginal, setCurrentOriginal] = useState("");
  const [currentModified, setCurrentModified] = useState("");
  const [results, setResults] = useState<TestResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const addTestData = () => {
    if (!currentOriginal.trim() || !currentModified.trim()) {
      alert("Mohon isi kedua field original dan modified text");
      return;
    }

    const newTestData: TestData = {
      id: Date.now(),
      original: currentOriginal.trim(),
      modified: currentModified.trim(),
    };

    setTestDataList([...testDataList, newTestData]);
    setCurrentOriginal("");
    setCurrentModified("");
  };

  const removeTestData = (id: number) => {
    setTestDataList(testDataList.filter((data) => data.id !== id));
  };

  const runAllTests = async () => {
    if (testDataList.length === 0) {
      alert("Tambahkan minimal satu data uji terlebih dahulu");
      return;
    }

    setIsProcessing(true);
    const testResults: TestResult[] = [];

    try {
      for (const testData of testDataList) {
        await new Promise((resolve) => setTimeout(resolve, 100));

        const originalEncrypted = encryptAES(testData.original);
        const modifiedEncrypted = encryptAES(testData.modified);
        const avalancheEffect = calculateAvalancheEffect(
          originalEncrypted,
          modifiedEncrypted
        );

        testResults.push({
          ...testData,
          avalancheEffect,
          originalEncrypted,
          modifiedEncrypted,
        });
      }
    } catch (error) {
      console.error("Error during encryption:", error);
      alert(
        "Terjadi error saat melakukan enkripsi. Pastikan CryptoJS tersedia."
      );
    }

    setResults(testResults);
    setIsProcessing(false);
  };

  const clearAll = () => {
    setTestDataList([]);
    setResults([]);
    setCurrentOriginal("");
    setCurrentModified("");
  };

  const getAvalancheColor = (percentage: number) => {
    if (percentage >= 45 && percentage <= 55)
      return "text-green-600 bg-green-50";
    if (percentage >= 30 && percentage <= 70)
      return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  return (
    <div className="mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Pengujian AES Avalanche Effect
        </h1>
        <p className="text-gray-600">
          Uji efek avalanche dari enkripsi AES dengan multiple data
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Tambah Data Pengujian
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teks Asli
            </label>
            <textarea
              value={currentOriginal}
              onChange={(e) => setCurrentOriginal(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Masukkan teks original..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teks Modifikasi
            </label>
            <textarea
              value={currentModified}
              onChange={(e) => setCurrentModified(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Masukkan teks modifikasi..."
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={addTestData}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tambah ke Daftar
          </button>
        </div>
      </div>

      {testDataList.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              Data Test ({testDataList.length})
            </h2>
            <div className="flex gap-2">
              <button
                onClick={runAllTests}
                disabled={isProcessing}
                className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
              >
                <Calculator className="w-4 h-4" />
                {isProcessing ? "Memproses..." : "Jalankan"}
              </button>
              <button
                onClick={clearAll}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Hapus Semua
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {testDataList.map((data, index) => (
              <div
                key={data.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-700 mb-1">
                      Uji #{index + 1}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Asli:</div>
                        <div className="text-sm bg-gray-50 p-2 rounded border max-h-20 overflow-y-auto">
                          {data.original}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">
                          Modifikasi:
                        </div>
                        <div className="text-sm bg-gray-50 p-2 rounded border max-h-20 overflow-y-auto">
                          {data.modified}
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeTestData(data.id)}
                    className="ml-2 text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Hasil Uji Avalanche Effect
          </h2>

          <div className="mb-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-800">
                Catatan Penting untuk pengujian AES:
              </span>
            </div>
            <div className="text-sm text-amber-700 space-y-2">
              <div>
                • <strong>IV Tetap:</strong> Implementasi AES Anda menggunakan
                IV tetap, jadi input sama akan menghasilkan output sama
              </div>
              <div>
                • <strong>Avalanche Effect Ideal:</strong>{" "}
                <span className="text-green-600 font-medium">45-55%</span>{" "}
                menunjukkan enkripsi yang baik
              </div>
              <div>
                • <strong>Jika hasil 0%:</strong> Berarti kedua input
                menghasilkan ciphertext yang sama (kemungkinan input identik)
              </div>
              <div>
                • <strong>Jika hasil &gt;80%:</strong> Bisa jadi ada masalah
                dalam perhitungan atau implementasi
              </div>
            </div>
          </div>

          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                Interpretasi Hasil:
              </span>
            </div>
            <div className="text-sm text-blue-700 space-y-1">
              <div>
                • <span className="text-green-600 font-medium">45-55%</span>:
                Avalanche effect ideal
              </div>
              <div>
                • <span className="text-yellow-600 font-medium">30-70%</span>:
                Avalanche effect cukup baik
              </div>
              <div>
                •{" "}
                <span className="text-red-600 font-medium">Di luar range</span>:
                Avalanche effect kurang baik
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {results.map((result, index) => (
              <div
                key={result.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-700">
                      Uji #{index + 1}
                    </span>
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getAvalancheColor(
                        result.avalancheEffect
                      )}`}
                    >
                      Avalanche Effect: {result.avalancheEffect.toFixed(2)}%
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">
                        Teks Asli:
                      </div>
                      <div className="bg-gray-50 p-2 rounded border max-h-16 overflow-y-auto">
                        {result.original}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">
                        Teks Asli Enkripsi:
                      </div>
                      <div className="bg-blue-50 p-2 rounded border font-mono text-xs max-h-16 overflow-y-auto break-all">
                        {result.originalEncrypted}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">
                        Teks Modifikasi:
                      </div>
                      <div className="bg-gray-50 p-2 rounded border max-h-16 overflow-y-auto">
                        {result.modified}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">
                        Teks Modifikasi Enkripsi:
                      </div>
                      <div className="bg-green-50 p-2 rounded border font-mono text-xs max-h-16 overflow-y-auto break-all">
                        {result.modifiedEncrypted}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-2">Ringkasan Hasil:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {
                    results.filter(
                      (r) => r.avalancheEffect >= 45 && r.avalancheEffect <= 55
                    ).length
                  }
                </div>
                <div className="text-gray-600">Ideal</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {
                    results.filter(
                      (r) =>
                        (r.avalancheEffect >= 30 && r.avalancheEffect < 45) ||
                        (r.avalancheEffect > 55 && r.avalancheEffect <= 70)
                    ).length
                  }
                </div>
                <div className="text-gray-600">Cukup Baik</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {
                    results.filter(
                      (r) => r.avalancheEffect < 30 || r.avalancheEffect > 70
                    ).length
                  }
                </div>
                <div className="text-gray-600">Kurang Baik</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
