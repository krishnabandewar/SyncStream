package com.syncstream.engine;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/execute")
@CrossOrigin(origins = "*") // Allow frontend access
public class ExecutionController {

    @PostMapping
    public ResponseEntity<ExecutionResult> executeCode(@RequestBody CodeRequest request) {
        // Validation: Ensure code is safely manageable
        if (request.getCode() == null || request.getCode().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new ExecutionResult("", "Code cannot be empty."));
        }

        try {
            // 1. Write code to a temporary file
            // unique file name to prevent collision
            String fileName = "Main_" + System.currentTimeMillis() + ".java";
            File sourceFile = new File(fileName);
            try (PrintWriter out = new PrintWriter(sourceFile)) {
                out.println(request.getCode());
            }

            // 2. Compile the code
            ProcessBuilder compileProcess = new ProcessBuilder("javac", fileName);
            Process javac = compileProcess.start();
            boolean compiled = javac.waitFor(5, TimeUnit.SECONDS);

            if (!compiled || javac.exitValue() != 0) {
                String error = readStream(javac.getErrorStream());
                return ResponseEntity.ok(new ExecutionResult("", "Compilation Error:\n" + error));
            }

            // 3. Run the code
            // For security in a real app, this MUST be inside Docker.
            // Here we run it locally but isolated in a separate process.
            String className = fileName.replace(".java", "");
            ProcessBuilder runProcess = new ProcessBuilder("java", className);
            Process java = runProcess.start();

            // Wait max 5 seconds (prevent infinite loops)
            boolean finished = java.waitFor(5, TimeUnit.SECONDS);

            if (!finished) {
                java.destroyForcibly();
                return ResponseEntity.ok(new ExecutionResult("", "Error: Time Limit Exceeded"));
            }

            String output = readStream(java.getInputStream());
            String error = readStream(java.getErrorStream());

            // Cleanup
            sourceFile.delete();
            new File(className + ".class").delete();

            return ResponseEntity.ok(new ExecutionResult(output, error));

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new ExecutionResult("", "Server Error: " + e.getMessage()));
        }
    }

    private String readStream(InputStream stream) {
        return new BufferedReader(new InputStreamReader(stream))
                .lines().collect(Collectors.joining("\n"));
    }
}

// DTOs
class CodeRequest {
    private String code;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}

class ExecutionResult {
    private String output;
    private String error;

    public ExecutionResult(String output, String error) {
        this.output = output;
        this.error = error;
    }

    public String getOutput() {
        return output;
    }

    public String getError() {
        return error;
    }
}
