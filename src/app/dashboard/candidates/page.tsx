"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, ExternalLink, Loader2, Search, FilterX } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type CvRecord = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  yearOfStudy: string;
  batch: string;
  cgpa: string;
  skills: string[];
  linkedinUrl: string;
  portfolioUrl: string;
  cvUrl: string;
  universityId: string;
};

export default function CandidatesPage() {
  const [data, setData] = useState<CvRecord[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState("");
  const [cgpaMin, setCgpaMin] = useState<string>("");
  const [cgpaMax, setCgpaMax] = useState<string>("");
  const [selectedDept, setSelectedDept] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const { data: cvs, error } = await supabase
        .from("CvBank")
        .select("*");

      if (!error && cvs) {
        setData(cvs);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const uniqueDepartments = useMemo(() => Array.from(new Set(data.map(d => d.department).filter(Boolean))), [data]);
  const uniqueYears = useMemo(() => Array.from(new Set(data.map(d => d.yearOfStudy).filter(Boolean))), [data]);

  const filteredData = useMemo(() => {
    return data.filter((cv) => {
      // Search
      const searchLower = search.toLowerCase();
      const matchesSearch = 
        (cv.fullName && cv.fullName.toLowerCase().includes(searchLower)) ||
        (cv.universityId && cv.universityId.toLowerCase().includes(searchLower));
      
      // CGPA
      const cgpa = parseFloat(cv.cgpa);
      const min = parseFloat(cgpaMin);
      const max = parseFloat(cgpaMax);
      const matchesCgpaMin = isNaN(min) || (cgpa >= min);
      const matchesCgpaMax = isNaN(max) || (cgpa <= max);

      // Dept / Year
      const matchesDept = selectedDept === "" || cv.department === selectedDept;
      const matchesYear = selectedYear === "" || cv.yearOfStudy === selectedYear;

      return matchesSearch && matchesCgpaMin && matchesCgpaMax && matchesDept && matchesYear;
    });
  }, [data, search, cgpaMin, cgpaMax, selectedDept, selectedYear]);

  const handleDownloadCsv = () => {
    if (filteredData.length === 0) return;

    const headers = [
      "Name", "University ID", "Email", "Phone", "Department", 
      "Year of Study", "CGPA", "Skills", "LinkedIn", "Portfolio", "CV URL"
    ];

    const csvContent = [
      headers.join(","),
      ...filteredData.map(cv => [
        `"${cv.fullName || ""}"`,
        `"${cv.universityId || ""}"`,
        `"${cv.email || ""}"`,
        `"${cv.phone || ""}"`,
        `"${cv.department || ""}"`,
        `"${cv.yearOfStudy || ""}"`,
        `"${cv.cgpa || ""}"`,
        `"${(cv.skills || []).join("; ")}"`,
        `"${cv.linkedinUrl || ""}"`,
        `"${cv.portfolioUrl || ""}"`,
        `"${cv.cvUrl || ""}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "candidates_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearFilters = () => {
    setSearch("");
    setCgpaMin("");
    setCgpaMax("");
    setSelectedDept("");
    setSelectedYear("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Talent Discovery</h1>
          <p className="text-muted-foreground mt-1">Search, filter and export candidates.</p>
        </div>
        <Button onClick={handleDownloadCsv} className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md font-medium">
          <Download className="w-4 h-4 mr-2" />
          Export CSV ({filteredData.length})
        </Button>
      </div>

      <Card className="border-border shadow-sm flex-shrink-0">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row flex-wrap gap-4 md:items-center">
            <div className="w-full md:flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search name or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-white w-full"
              />
            </div>

            <div className="w-full md:w-auto">
              <select 
                className="w-full md:w-[180px] h-10 px-3 py-2 rounded-md border border-primary/20 bg-primary/5 text-primary text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
              >
                <option value="">All Departments</option>
                {uniqueDepartments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div className="w-full md:w-auto">
              <select 
                className="w-full md:w-[160px] h-10 px-3 py-2 rounded-md border border-primary/20 bg-primary/5 text-primary text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option value="">All Years of Study</option>
                {uniqueYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between gap-2 w-full md:w-auto">
              <Input
                type="number"
                placeholder="Min CGPA"
                value={cgpaMin}
                onChange={(e) => setCgpaMin(e.target.value)}
                className="bg-white flex-1 md:w-[100px]"
                step="0.01"
                min="0"
                max="4"
              />
              <span className="text-muted-foreground text-sm shrink-0">-</span>
              <Input
                type="number"
                placeholder="Max CGPA"
                value={cgpaMax}
                onChange={(e) => setCgpaMax(e.target.value)}
                className="bg-white flex-1 md:w-[100px]"
                step="0.01"
                min="0"
                max="4"
              />
            </div>

            <div className="w-full md:w-auto flex shrink-0">
              <Button variant="ghost" onClick={clearFilters} className="w-full text-muted-foreground" title="Clear Filters">
                <FilterX className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="flex-1 overflow-hidden border-border shadow-sm flex flex-col">
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader className="bg-primary/5 sticky top-0 z-10 shadow-sm border-b border-primary/10">
              <TableRow>
                <TableHead className="font-medium">Candidate</TableHead>
                <TableHead className="font-medium">Department</TableHead>
                <TableHead className="font-medium text-right">CGPA</TableHead>
                <TableHead className="font-medium">Skills</TableHead>
                <TableHead className="font-medium text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    No candidates found matching the filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((cv) => (
                  <TableRow key={cv.id} className="hover:bg-primary/5 transition-colors border-b border-border/50">
                    <TableCell>
                      <div className="font-medium text-foreground">{cv.fullName || "N/A"}</div>
                      <div className="text-xs text-muted-foreground">{cv.universityId || "No ID"}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{cv.department || "N/A"}</div>
                      <div className="text-xs text-muted-foreground">Year of Study: {cv.yearOfStudy || "N/A"}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="inline-flex font-mono text-sm font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">
                        {cv.cgpa || "N/A"}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      <div className="flex flex-wrap gap-1">
                        {(cv.skills || []).slice(0, 3).map((skill, i) => (
                          <Badge key={i} variant="secondary" className="text-[10px] font-normal px-1.5 py-0">
                            {skill}
                          </Badge>
                        ))}
                        {(cv.skills || []).length > 3 && (
                          <Badge variant="secondary" className="text-[10px] font-normal px-1.5 py-0">
                            +{(cv.skills || []).length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {cv.cvUrl ? (
                        <a 
                          href={cv.cvUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-primary hover:text-primary-foreground px-3 py-1.5 text-primary bg-primary/10 border border-primary/20"
                        >
                          <ExternalLink className="w-4 h-4 mr-1.5" />
                          View CV
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground">No CV</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
